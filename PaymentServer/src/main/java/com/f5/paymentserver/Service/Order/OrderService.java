package com.f5.paymentserver.Service.Order;

import com.f5.paymentserver.DTO.Order.OrderDTO;
import com.f5.paymentserver.DTO.Order.OrderProductDTO;
import com.f5.paymentserver.DTO.Order.OrderResponseDTO;

import com.f5.paymentserver.Entity.Payment.OrderEntity;

import java.util.List;

public interface OrderService {
    OrderResponseDTO createOrderList(OrderDTO orderDTO, List<OrderProductDTO> orderItemDTOList);
    void deleteOrderList(Long id);
    OrderEntity findByOrderId(Long orderId);
    void deleteOrder(OrderEntity order);
    List<OrderEntity> findByOrderConsumer(String name);
}
