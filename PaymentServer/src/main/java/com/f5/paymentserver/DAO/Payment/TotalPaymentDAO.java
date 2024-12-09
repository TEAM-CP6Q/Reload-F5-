package com.f5.paymentserver.DAO.Payment;

import com.f5.paymentserver.Entity.Payment.PaymentEntity;
import com.f5.paymentserver.Entity.Payment.TotalPaymentEntity;

import java.util.List;
import java.util.Map;

public interface TotalPaymentDAO {
     Map<String, Object> createTotalPayment(Long id);
     Map<String, Object> readTotalPaymentByConsumer(String purchaser);
     List<PaymentEntity> readPaymentById(Long paymentId);
     //     Map<String, Object> updateTotalPayment(TotalPaymentEntity totalPayment);
     Map<String, Object> deleteTotalPayment(Long paymentId);
     Boolean existsByPaymentUid(String paymentUid);
}
