package com.f5.paymentserver.Repository.Payment;

import com.f5.paymentserver.Entity.Payment.TotalPaymentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TotalPaymentRepository extends JpaRepository<TotalPaymentEntity, Long> {

    boolean existsById(Long totalPaymentId);
    TotalPaymentEntity findAllById(Long totalPaymentId);
    List<TotalPaymentEntity> findByConsumer(String purchaser);
    Boolean existsByPayUniqId(String paymentUid);
    TotalPaymentEntity getByConsumerAndCreatedOn(String consumer, LocalDateTime createdOn);
}
