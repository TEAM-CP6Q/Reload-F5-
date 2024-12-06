package com.f5.paymentserver.Controller.Payment;

import com.f5.paymentserver.Controller.Order.OrderController;
//import com.f5.paymentserver.DTO.Payment.PaymentRequestDTO;
import com.f5.paymentserver.DTO.Payment.GlobalResponseDTO;
import com.f5.paymentserver.DTO.Payment.PaymentRequestDTO;
import com.f5.paymentserver.DTO.Payment.PaymentResponseDTO;
import com.f5.paymentserver.DTO.Payment.ResponseDTO;
import com.f5.paymentserver.Service.Payment.PaymentService;
import com.siot.IamportRestClient.exception.IamportResponseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {
    private final PaymentService paymentService;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@RequestBody PaymentRequestDTO paymentRequestDTO) throws IamportResponseException, IOException {
        GlobalResponseDTO response = paymentService.createImportPayment(paymentRequestDTO);
        if (paymentRequestDTO.getPaymentUid() == null) {
            return ResponseEntity.badRequest().body("Invalid request: paymentUid is null");
        }else if(paymentRequestDTO.getOrderUid() == null) {
            return ResponseEntity.badRequest().body("orderUid null");
        }
        if(response.getResult().equals("success")){
            logger.info("결제 내역 생성: 결제 내역 생성 성공");
            return ResponseEntity.status(201).body(response);
        }
        logger.error("결제 내역 생성: 결제 내역 생성 실패");
        return ResponseEntity.status(500).body(null);
    }

    @GetMapping("/read/user/{consumer}")
    public ResponseEntity<ResponseDTO> readPaymentByConsumer(@PathVariable String consumer){
        ResponseDTO response = paymentService.readPaymentByConsumer(consumer);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - readPaymentByPurchaser: Payment found for purchaser: {}", consumer);
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - readPaymentByPurchaser: Failed to read payment for purchaser: {}", consumer);
        return ResponseEntity.status(500).body(null);
    }

    @DeleteMapping("/delete/{paymentId}")
    public ResponseEntity<GlobalResponseDTO> deletePayment(@PathVariable Long paymentId){
        GlobalResponseDTO response = paymentService.deletePayment(paymentId);
        if(response.getResult().equals("success")){
            logger.info("Controller Layer - deletePayment: Payment deleted successfully with ID: {}", paymentId);
            return ResponseEntity.status(200).body(response);
        }
        logger.error("Controller Layer - deletePayment: Failed to delete payment with ID: {}", paymentId);
        return ResponseEntity.status(500).body(null);
    }
}
