package com.f5.paymentserver.DAO.Payment;

import com.f5.paymentserver.Entity.Payment.PaymentEntity;

import java.util.Map;

public interface PaymentDAO {
    Map<String, Object> createPayment(PaymentEntity payment);
    Map<String, Object> deletePayment(PaymentEntity payment);
}
