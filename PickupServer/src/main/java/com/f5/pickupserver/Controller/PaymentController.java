package com.f5.pickupserver.Controller;

import com.f5.pickupserver.DTO.Respons.PaymentDTO;
import com.f5.pickupserver.DTO.Respons.StatusCodeDTO;
import com.f5.pickupserver.Entity.PaymentEntity;
import com.f5.pickupserver.Entity.PickupListEntity;
import com.f5.pickupserver.Repository.PaymentRepository;
import com.f5.pickupserver.Repository.PickupListRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.UUID;

import static com.fasterxml.jackson.databind.type.LogicalType.Map;

@RestController
@RequestMapping("/api/pickup/payment")
public class PaymentController {
    private final PickupListRepository pickupListRepository;
    private final PaymentRepository paymentRepository;

    public PaymentController(PickupListRepository pickupListRepository, PaymentRepository paymentRepository) {
        this.pickupListRepository = pickupListRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/get-merchant-uid")
    public ResponseEntity<?> getMerchantUid(@RequestParam("pickupId") Long pickupId) {
        if (pickupListRepository.existsByPickupId(pickupId)) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .msg("Pickup list not found")
                            .code(404L)
                            .build());
        }
        return ResponseEntity.ok(PaymentDTO.builder()
                        .pickupId(pickupId)
                        .merchantUid(generateMerchantUid())
                        .build());
    }

    @PatchMapping("/update-payment")
    public ResponseEntity<?> updatePayment(@RequestParam("pickupId") Long pickupId, @RequestParam("merchantUid") String merchantUid) {
        PickupListEntity pickupList = pickupListRepository.findByPickupId(pickupId);
        if (pickupList == null) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg("Pickup list not found")
                            .build());
        }
        try{
            PaymentEntity paymentEntity = new PaymentEntity();
            paymentEntity.setPickupListEntity(pickupList);
            paymentEntity.setMerchantUid(merchantUid);
            paymentRepository.save(paymentEntity);
            pickupList.setPayment(true);
            pickupListRepository.save(pickupList);
            LinkedHashMap<Object,Object> map = new LinkedHashMap<>();
            map.put(paymentEntity, pickupList);
            return ResponseEntity.ok(map);
        } catch (Exception e){
            return ResponseEntity.status(405).body(StatusCodeDTO.builder()
                            .code(405L)
                            .msg("결제 내역 저장 및 수정 실패")
                            .build());
        }
    }

    private String generateMerchantUid() {
        // 현재 날짜와 시간을 포함한 고유한 문자열 생성
        String uniqueString = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime today = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDay = today.format(formatter).replace("-", "");

        // 무작위 문자열과 현재 날짜/시간을 조합하여 주문번호 생성
        return formattedDay +'-'+ uniqueString;
    }
}
