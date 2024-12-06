package com.f5.test;

import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Repository
public class OrderDAOImpl implements OrderDAO{
    private final OrderRepository orderRepository;

    public OrderDAOImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Override
    public Map<String, Object> createPayment(OrderEntity order) {
        Map<String, Object> result = new HashMap<>();
        order.setCreatedOn(LocalDateTime.now());
        orderRepository.save(order);
        result.put("result", "success");
        return result;
    }
}