package com.f5.paymentserver.DAO.Order;

import com.f5.paymentserver.Entity.Payment.OrderEntity;

import java.util.List;
import java.util.Map;

public interface OrderDAO {
    Map<String, Object> createPayment(OrderEntity order);
    void deleteOrderList(Long id);
    OrderEntity readOrder(Long orderId);
    void deleteOrder(OrderEntity order);
    List<OrderEntity> readOrderDetail(String name);
}
