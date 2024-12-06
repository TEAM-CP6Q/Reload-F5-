package com.f5.paymentserver.Repository.Order;

import com.f5.paymentserver.Entity.Payment.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    OrderEntity findAllById(Long id);
    boolean existsById(Long id);
    List<OrderEntity> findByConsumer(String name);
}
