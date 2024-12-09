package com.f5.paymentserver.DTO.Payment;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class TotalPaymentDTO {
    private Long totalPaymentId;
    private String consumer;
    private Long totalPrice;
    private String createdOn;
    private List<PaymentDTO> paymentDTOS;
}
