package com.f5.paymentserver.DAO.Payment;

import com.f5.paymentserver.Entity.Payment.PaymentEntity;
import com.f5.paymentserver.Entity.Payment.TotalPaymentEntity;
import com.f5.paymentserver.Repository.Payment.PaymentRepository;
import com.f5.paymentserver.Repository.Payment.TotalPaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class TotalPaymentDAOImpl implements TotalPaymentDAO {
    private final TotalPaymentRepository totalPaymentRepository;
    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY = 100L;
    private final PaymentRepository paymentRepository;

    @Autowired
    public TotalPaymentDAOImpl(TotalPaymentRepository totalPaymentRepository, PaymentRepository paymentRepository) {
        this.totalPaymentRepository = totalPaymentRepository;
        this.paymentRepository = paymentRepository;
    }

//    @Override
//    public Map<String, Object> createTotalPayment(TotalPaymentEntity totalPayment) {
//        Map<String, Object> result = new HashMap<>();
//
////        totalPayment.updateDateTime(LocalDateTime.now());
//        totalPaymentRepository.save(totalPayment);
//
//        if(totalPaymentRepository.existsById(totalPayment.getId())){
//            result.put("result", "success");
//            result.put("message", "결제가 완료되었습니다.");
//        } else{
//            result.put("result", "fail");
//            result.put("message", "TotalPayment가 정상적으로 저장되지 않았습니다.");
//        }
//
//        return result;
//    }

//    @Override
//    public Map<String, Object> createTotalPayment(TotalPaymentEntity totalPayment) {
//        Map<String, Object> result = new HashMap<>();
//        int attempts = 0;
//
//        while (attempts < MAX_RETRIES) {
//            try {
//                totalPayment.updateDateTime(LocalDateTime.now());
//                TotalPaymentEntity savedPayment = totalPaymentRepository.saveAndFlush(totalPayment);
//
//                if (totalPaymentRepository.existsById(savedPayment.getId())) {
//                    result.put("result", "success");
//                    result.put("message", "결제가 완료되었습니다.");
//                } else {
//                    result.put("result", "fail");
//                    result.put("message", "TotalPayment가 정상적으로 저장되지 않았습니다.");
//                }
//                return result;
//
//            } catch (ObjectOptimisticLockingFailureException | StaleObjectStateException e) {
//                attempts++;
//                if (attempts == MAX_RETRIES) {
//                    result.put("result", "fail");
//                    result.put("message", "결제 처리 중 충돌이 발생했습니다. 다시 시도해주세요.");
//                    return result;
//                }
//                try {
//                    Thread.sleep(RETRY_DELAY * attempts);
//                } catch (InterruptedException ie) {
//                    Thread.currentThread().interrupt();
//                    throw new RuntimeException("결제 처리가 중단되었습니다.", ie);
//                }
//            }
//        }
//        return result;
//    }

    @Override
    public Map<String, Object> createTotalPayment(Long id) {
        Map<String, Object> result = new HashMap<>();
        //totalPaymentRepository.save(totalPayment);

        result.put("result", totalPaymentRepository.existsById(id) ? "success" : "fail");
        result.put("message", result.get("result").equals("success") ? "결제가 완료되었습니다." : "저장 실패");

        return result;
    }

    @Override
    public Map<String, Object> readTotalPaymentByConsumer(String purchaser) {
        Map<String, Object> result = new HashMap<>();

        List<TotalPaymentEntity> totalPaymentEntities = totalPaymentRepository.findByConsumer(purchaser);

        if(!totalPaymentEntities.isEmpty()){
            result.put("result", "success");
            result.put("dataList", totalPaymentEntities);
        } else{
            result.put("result", "fail");
            result.put("message", "해당 고객의 결제 내역이 없습니다.");
        }
        return result;
    }

    @Override
    public List<PaymentEntity> readPaymentById(Long paymentId) {
        TotalPaymentEntity totalPayment = totalPaymentRepository.findAllById(paymentId);
        return paymentRepository.getAllByTotalPaymentId(totalPayment.getId());
    }

//    @Override
//    public Map<String, Object> updateTotalPayment(TotalPaymentEntity totalPayment) {
//        Map<String, Object> result = new HashMap<>();
//        TotalPaymentEntity oldTotalPayment = totalPaymentRepository.findAllById(totalPayment.getId());
//
//        if (oldTotalPayment != null) {
//            oldTotalPayment.setId(totalPayment.getId());
//            oldTotalPayment.setConsumer(totalPayment.getConsumer());
//            oldTotalPayment.setTotalPrice(totalPayment.getTotalPrice());
//            oldTotalPayment.setCreatedOn(totalPayment.getCreatedOn());
//
//            // 더 효과적인 방법으로 컬렉션 업데이트
//            if (totalPayment.getPayments() != null) {
//                oldTotalPayment.getPayments().clear();
//                totalPaymentRepository.save(oldTotalPayment);
//
//                oldTotalPayment.getPayments().addAll(totalPayment.getPayments());
////                for (Payment payment : totalPayment.getPayments()) {
////                    payment.setTotalPayment(oldTotalPayment);
////                }
//            }
//
//            totalPaymentRepository.save(oldTotalPayment);
//            result.put("result", "success");
//        } else {
//            result.put("result", "fail");
//        }
//
//        return result;
//    }

    @Override
    public Map<String, Object> deleteTotalPayment(Long paymentId) {
        Map<String, Object> result = new HashMap<>();

        TotalPaymentEntity totalPayment = totalPaymentRepository.findAllById(paymentId);

        if(totalPayment == null){
            result.put("result", "fail");
            result.put("message", "해당하는 TotalPayment가 DB에 존재하지 않습니다.");
            return result;
        }

        totalPaymentRepository.delete(totalPayment);

        if(totalPaymentRepository.existsById(paymentId)){
            result.put("result", "fail");
            result.put("message", "TotalPayment가 정상적으로 삭제되지 않았습니다.");
        } else{
            result.put("result", "success");
        }

        return result;
    }

    @Override
    public Boolean existsByPaymentUid(String paymentUid){
        return totalPaymentRepository.existsByPayUniqId(paymentUid);
    }
}
