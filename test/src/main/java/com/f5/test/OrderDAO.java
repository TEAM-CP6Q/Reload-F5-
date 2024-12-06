package com.f5.test;

import java.util.Map;

public interface OrderDAO {
    Map<String, Object> createPayment(OrderEntity order);
}