package com.f5.paymentserver.DTO.Payment;

import lombok.*;

@Data
public class PaymentRequestDTO {
    private String paymentUid; // 결제 고유 번호
    private Long orderUid; // 주문 고유 번호
}
