package com.f5.paymentserver.Repository.Payment;

import com.f5.paymentserver.Entity.Payment.PaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;


@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    PaymentEntity findByPaymentId(Long paymentId);
    Boolean existsByPaymentId(Long paymentId);
    Boolean removeByPaymentId(Long paymentId);
    PaymentEntity findByProductIdAndConsumer(Long productId, String consumer);
    PaymentEntity getByConsumerAndCreatedOn(String consumer, LocalDateTime createdOn);
    List<PaymentEntity> getAllByTotalPaymentId(Long totalPaymentId);
}
