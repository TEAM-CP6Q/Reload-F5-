package com.f5.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderDAO orderDAO;
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    public OrderServiceImpl(OrderDAO orderDAO) {
        this.orderDAO = orderDAO;
    }

    @Override
    public OrderResponseDTO createOrderList(OrderDTO orderDTO, List<OrderProductDTO> orderItemDTOList) {
        OrderEntity order = toOrderEntity(orderDTO, orderItemDTOList);
        logger.info("OrderServiceImpl : {}", order);
        Map<String, Object> resultMap = orderDAO.createPayment(order);
        logger.info("OrderServiceImpl-resultMap : {}", resultMap);
        return toOrderResponseDTO(resultMap, order.getId());
    }

    public OrderEntity toOrderEntity(OrderDTO orderDTO, List<OrderProductDTO> orderItemDTOList){
        return OrderEntity.builder()
                .id(orderDTO.getId())
                .consumer(orderDTO.getConsumer())
                .totalPrice(orderDTO.getTotalPrice())
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

    public OrderResponseDTO toOrderResponseDTO(Map<String, Object> resultMap, Long orderId){
        return OrderResponseDTO.builder()
                .result(resultMap.get("result").toString())
                .orderId(orderId)
                .build();
    }
}