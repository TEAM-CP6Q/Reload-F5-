package com.f5.paymentserver.Service.Order;

import com.f5.paymentserver.Controller.Order.OrderController;
import com.f5.paymentserver.DAO.Order.OrderDAO;
import com.f5.paymentserver.DTO.Order.OrderDTO;
import com.f5.paymentserver.DTO.Order.OrderProductDTO;
import com.f5.paymentserver.DTO.Order.OrderResponseDTO;
import com.f5.paymentserver.Entity.Payment.OrderEntity;
import com.f5.paymentserver.Entity.Payment.OrderProductEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderDAO orderDAO;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    public OrderServiceImpl(OrderDAO orderDAO) {
        this.orderDAO = orderDAO;
    }

    @Override
    public List<OrderEntity> findByOrderConsumer(String name) {
        return orderDAO.readOrderDetail(name);
    }

    @Override
    public OrderResponseDTO createOrderList(OrderDTO orderDTO, List<OrderProductDTO> orderItemDTOList) {
        // 주문번호 생성
        String merchantUid = generateMerchantUid();

        // OrderEntity 생성 시 주문번호 추가
        OrderEntity order = toOrderEntity(orderDTO, orderItemDTOList);
        order.setMerchantUid(merchantUid); // 주문번호 설정

        logger.info("OrderServiceImpl - Created Order: {}", order.getMerchantUid());

        // 결제 생성
        Map<String, Object> resultMap = orderDAO.createPayment(order);

        // 응답 DTO 변환
        return toOrderResponseDTO(resultMap, order.getId(), order.getMerchantUid());
    }

    @Override
    public OrderEntity findByOrderId(Long orderId) {
        return orderDAO.readOrder(orderId);
    }


    // 주문번호 생성 메서드
    private String generateMerchantUid() {
        // 현재 날짜와 시간을 포함한 고유한 문자열 생성
        String uniqueString = UUID.randomUUID().toString().replace("-", "");
        LocalDateTime today = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        String formattedDay = today.format(formatter).replace("-", "");

        // 무작위 문자열과 현재 날짜/시간을 조합하여 주문번호 생성
        return formattedDay +'-'+ uniqueString;
    }
    @Override
    public void deleteOrder(OrderEntity order) {
        orderDAO.deleteOrder(order);
    }

    @Override
    public void deleteOrderList(Long id) {
        try{
            orderDAO.deleteOrderList(id);
        } catch (Exception e){
            throw new IllegalStateException(e);
        }
    }

    public OrderEntity toOrderEntity(OrderDTO orderDTO, List<OrderProductDTO> orderItemDTOList){
        return OrderEntity.builder()
                .id(orderDTO.getId())
                .consumer(orderDTO.getConsumer())
                .totalPrice(orderDTO.getTotalPrice())
                .merchantUid(orderDTO.getMerchantUid())
                .orderProductList(toOrderItemEntity(orderItemDTOList))
                .build();
    }

    public List<OrderProductEntity> toOrderItemEntity(List<OrderProductDTO> orderItemDTOList){
        List<OrderProductEntity> orderItemList = new ArrayList<>();

        for(OrderProductDTO orderItemDTO : orderItemDTOList){
            OrderProductEntity orderItem = OrderProductEntity.builder()
                    .id(orderItemDTO.getId())
                    .productId(orderItemDTO.getProductId())
                    .price(orderItemDTO.getPrice())
                    .amount(orderItemDTO.getAmount())
                    .build();
            orderItemList.add(orderItem);
        }

        return orderItemList;
    }

    public OrderResponseDTO toOrderResponseDTO(Map<String, Object> resultMap, Long orderId, String id){
        return OrderResponseDTO.builder()
                .result(resultMap.get("result").toString())
                .orderId(orderId)
                .merchantUid(id)
                .build();
    }
}
