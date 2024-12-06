package com.f5.paymentserver.DTO.Payment;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class PaymentDTO {
    private Long paymentId;
    private Long productId;
    private Long price;
    private Long amount;
    private String consumer;
    private LocalDateTime createdOn;
}
