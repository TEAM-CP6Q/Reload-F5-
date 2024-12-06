package com.f5.paymentserver.Service.Payment;

import com.f5.paymentserver.Controller.Order.OrderController;
import com.f5.paymentserver.DAO.Payment.TotalPaymentDAO;
import com.f5.paymentserver.DTO.Payment.*;
import com.f5.paymentserver.Entity.Payment.OrderEntity;
import com.f5.paymentserver.Entity.Payment.OrderProductEntity;
import com.f5.paymentserver.Entity.Payment.PaymentEntity;
import com.f5.paymentserver.Entity.Payment.TotalPaymentEntity;
import com.f5.paymentserver.Repository.Order.OrderRepository;
import com.f5.paymentserver.Repository.Payment.PaymentRepository;
import com.f5.paymentserver.Repository.Payment.TotalPaymentRepository;
import com.f5.paymentserver.Service.Order.OrderService;
import com.siot.IamportRestClient.IamportClient;
import com.siot.IamportRestClient.request.CancelData;
import com.siot.IamportRestClient.response.IamportResponse;
import com.siot.IamportRestClient.response.Payment;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PaymentServiceImpl implements PaymentService {
    private final TotalPaymentDAO totalPaymentDAO;
    private final IamportClient iamportClient;
    private final OrderService orderService;

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final TotalPaymentRepository totalPaymentRepository;
    //    private final PaymentDAO paymentDAO;

    public PaymentServiceImpl(TotalPaymentDAO totalPaymentDAO, IamportClient iamportClient, OrderService orderService, PaymentRepository paymentRepository, OrderRepository orderRepository, TotalPaymentRepository totalPaymentRepository) {
        this.totalPaymentDAO = totalPaymentDAO;
        this.iamportClient = iamportClient;
        this.orderService = orderService;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.totalPaymentRepository = totalPaymentRepository;
    }


    @Override
    public GlobalResponseDTO createImportPayment(PaymentRequestDTO request) {
        try {
            logger.info("createImportPayment 시작: {}", request);
            OrderEntity order = orderService.findByOrderId(request.getOrderUid());
            IamportResponse<Payment> iamportResponse = iamportClient.paymentByImpUid(request.getPaymentUid());

            logger.info("결제 금액 검증 시작 - DB금액: {}, 실제결제금액: {}",
                    order.getTotalPrice(),
                    iamportResponse.getResponse().getAmount().intValue());

            if (iamportResponse.getResponse().getAmount().intValue() != order.getTotalPrice()) {
                orderService.deleteOrder(order);
                iamportClient.cancelPaymentByImpUid(new CancelData(request.getPaymentUid(), true));
                return new GlobalResponseDTO("fail", "결제금액 불일치");
            }

            if (totalPaymentDAO.existsByPaymentUid(request.getPaymentUid())) {
                logger.info("이미 처리된 결제: {}", request.getPaymentUid());
                return new GlobalResponseDTO("success", "이미 처리된 결제입니다.");
            }

            // ID는 Hibernate가 자동 생성하도록 설정
            TotalPaymentEntity totalPayment = toTotalPaymentEntity(order, request.getPaymentUid());

            Map<String, Object> result = new HashMap<>();
            result.put("result", totalPaymentRepository.existsById(totalPayment.getId()) ? "success" : "fail");
            result.put("message", result.get("result").equals("success") ? "결제가 완료되었습니다." : "저장 실패");

            return toGlobalResponseDTO(result);

        } catch (Exception e) {
            logger.error("createImportPayment 실패", e);
            throw new RuntimeException("결제 처리 실패", e);
        }
    }

//        @Override
//        public GlobalResponseDTO createPayment(OrderEntity order, String paymentUid) {
//            if(totalPaymentDAO.existsByPaymentUid(paymentUid)){
//                return new GlobalResponseDTO("success", "이미 결제가 완료되었습니다.");
//            }
//
//            //Map<String, Object> resultMap = totalPaymentDAO.createTotalPayment(toTotalPaymentEntity(order, paymentUid));
//
//            GlobalResponseDTO globalResponseDTO = toGlobalResponseDTO(resultMap);
//            return globalResponseDTO;
//        }

    @Override
    public ResponseDTO readPaymentByConsumer(String purchaser) {
        Map<String, Object> resultMap = totalPaymentDAO.readTotalPaymentByConsumer(purchaser);
        ResponseDTO responseDTO = toResponseDTO(resultMap);
        return responseDTO;
    }

    @Override
    public GlobalResponseDTO deletePayment(Long totalPaymentId) {
        Map<String, Object> resultMap = totalPaymentDAO.deleteTotalPayment(totalPaymentId);

        GlobalResponseDTO globalResponseDTO = toGlobalResponseDTO(resultMap);
        return globalResponseDTO;
    }

    public TotalPaymentEntity toTotalPaymentEntity(OrderEntity order, String payUniqId) {
        // TotalPaymentEntity 생성 및 설정
        TotalPaymentEntity totalPayment = new TotalPaymentEntity();
        totalPayment.setConsumer(order.getConsumer());
        totalPayment.setTotalPrice(order.getTotalPrice());
        totalPayment.setPayUniqId(payUniqId);
        totalPayment.setCreatedOn(LocalDateTime.now());
        //totalPaymentRepository.save(totalPayment);
        // 저장 후 반환된 엔티티 사용
        TotalPaymentEntity savedTotalPayment = totalPaymentRepository.save(totalPayment);


        List<PaymentEntity> paymentList = new ArrayList<>();
        for(OrderProductEntity orderItem : order.getOrderProductList()){
            PaymentEntity payment = new PaymentEntity();
            payment.setProductId(orderItem.getProductId());
            payment.setPrice(orderItem.getPrice());
            payment.setAmount(orderItem.getAmount());
            payment.setConsumer(order.getConsumer());
            payment.setCreatedOn(LocalDateTime.now());
            payment.setTotalPaymentId(savedTotalPayment.getId());

            // save 후 반환된 엔티티를 리스트에 추가
            PaymentEntity savedPayment = paymentRepository.save(payment);
            paymentList.add(savedPayment);
        }

        // 자식 엔티티가 포함된 상태로 다시 저장
        return totalPaymentRepository.getReferenceById(savedTotalPayment.getId());
    }

//    public List<PaymentEntity> toPaymentEntity(List<OrderProductEntity> orderProductList, String consumer, TotalPaymentEntity totalPayment) {
//
//        return paymentList;
//    }

    public GlobalResponseDTO toGlobalResponseDTO(Map<String, Object> resultMap) {
        GlobalResponseDTO globalResponseDTO;

        globalResponseDTO = GlobalResponseDTO.builder()
                .result((String) resultMap.get("result"))
                .message((String) resultMap.get("message"))
                .build();

        return globalResponseDTO;
    }

    public PaymentDTO toPaymentDTO(PaymentEntity payment){
        PaymentDTO paymentDTO = PaymentDTO.builder()
                .paymentId(payment.getPaymentId())
                .productId(payment.getProductId())
                .amount(payment.getAmount())
                .price(payment.getPrice())
                .consumer(payment.getConsumer())
                .createdOn(LocalDateTime.parse(payment.getCreatedOn().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
                .build();

        return paymentDTO;
    }

    public List<PaymentDTO> toPaymentDTOS(List<PaymentEntity> paymentEntities){
        List<PaymentDTO> paymentDTOS = new ArrayList<>();

        for(PaymentEntity payment : paymentEntities){
            PaymentDTO paymentDTO = toPaymentDTO(payment);
            paymentDTOS.add(paymentDTO);
        }

        return paymentDTOS;
    }

    public ResponseDTO toResponseDTO(Map<String, Object> resultMap) {
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")) {
            TotalPaymentEntity totalPayment = (TotalPaymentEntity) resultMap.get("data");

            TotalPaymentDTO totalPaymentDTO = TotalPaymentDTO.builder()
                    .totalPaymentId(totalPayment.getId())
                    .consumer(totalPayment.getConsumer())
                    .totalPrice(totalPayment.getTotalPrice())
                    .createdOn(totalPayment.getCreatedOn().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
                    .paymentDTOS(toPaymentDTOS(paymentRepository.getAllByTotalPaymentId(totalPayment.getId())))
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(totalPaymentDTO)
                    .build();
        } else if (resultMap.containsKey("dataList")) {
            List<TotalPaymentEntity> totalPaymentEntities = (List<TotalPaymentEntity>) resultMap.get("dataList");
            List<TotalPaymentDTO> totalPaymentDTOS = new ArrayList<>();

            for (TotalPaymentEntity totalPayment : totalPaymentEntities) {
                TotalPaymentDTO totalPaymentDTO = TotalPaymentDTO.builder()
                        .totalPaymentId(totalPayment.getId())
                        .consumer(totalPayment.getConsumer())
                        .totalPrice(totalPayment.getTotalPrice())
                        .createdOn(String.valueOf(LocalDateTime.parse(totalPayment.getCreatedOn().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))))
                        .paymentDTOS(toPaymentDTOS(paymentRepository.getAllByTotalPaymentId(totalPayment.getId())))
                        .build();
                totalPaymentDTOS.add(totalPaymentDTO);
            }

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(totalPaymentDTOS)
                    .build();
        } else {
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .message((String) resultMap.get("message"))
                    .data(null)
                    .build();
        }

        return responseDTO;
    }

    public ResponseDTO toPaymentResponseDTO(Map<String, Object> resultMap){
        ResponseDTO responseDTO;

        if (resultMap.containsKey("data")) {
            PaymentEntity payment = (PaymentEntity) resultMap.get("data");

            PaymentDTO paymentDTO = PaymentDTO.builder()
                    .paymentId(payment.getPaymentId())
                    .productId(payment.getProductId())
                    .price(payment.getPrice())
                    .amount(payment.getAmount())
                    .consumer(payment.getConsumer())
                    .createdOn(LocalDateTime.parse(payment.getCreatedOn().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
                    .build();

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(paymentDTO)
                    .build();
        } else if (resultMap.containsKey("dataList")) {
            List<PaymentEntity> paymentEntities = (List<PaymentEntity>) resultMap.get("dataList");
            List<PaymentDTO> paymentDTOS = new ArrayList<>();

            for (PaymentEntity payment : paymentEntities) {
                PaymentDTO paymentDTO = PaymentDTO.builder()
                        .paymentId(payment.getPaymentId())
                        .productId(payment.getProductId())
                        .price(payment.getPrice())
                        .amount(payment.getAmount())
                        .consumer(payment.getConsumer())
                        .createdOn(LocalDateTime.parse(payment.getCreatedOn().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))))
                        .build();
                paymentDTOS.add(paymentDTO);
            }

            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .data(paymentDTOS)
                    .build();
        } else {
            responseDTO = ResponseDTO.builder()
                    .result((String) resultMap.get("result"))
                    .message((String) resultMap.get("message"))
                    .data(null)
                    .build();
        }

        return responseDTO;
    }

}
