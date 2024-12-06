package com.f5.paymentserver.DAO.Payment;

import com.f5.paymentserver.Entity.Payment.PaymentEntity;
import com.f5.paymentserver.Repository.Payment.PaymentRepository;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Component
public class PaymentDAOImpl implements PaymentDAO{
    private final PaymentRepository paymentRepository;

    public PaymentDAOImpl(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Override
    public Map<String, Object> createPayment(PaymentEntity payment) {
        Map<String, Object> result = new HashMap<>();

        if(paymentRepository.existsByPaymentId(payment.getPaymentId())){
            result.put("result", "fail");
            result.put("message", "해당하는 Payment가 DB에 존재합니다.");
            return result;
        }

        payment.setCreatedOn(LocalDateTime.now());
        paymentRepository.save(payment);

        if(paymentRepository.existsByPaymentId(payment.getPaymentId())){
            result.put("result", "success");
            result.put("data", paymentRepository.findByPaymentId(payment.getPaymentId()));
        } else{
            result.put("result", "fail");
            result.put("message", "Payment가 정상적으로 저장되지 않았습니다.");
        }

        return result;
    }

    @Override
    public Map<String, Object> deletePayment(PaymentEntity payment) {
        Map<String, Object> result = new HashMap<>();
        Long paymentId = payment.getPaymentId();
        paymentRepository.delete(payment);
        paymentRepository.flush(); // 데이터베이스 동기화

        if(paymentRepository.existsByPaymentId(paymentId)){
            result.put("result", "fail");
            result.put("message", "Payment가 정상적으로 삭제되지 않았습니다.");
        } else{
            result.put("result", "success");
        }

        return result;
    }
}
