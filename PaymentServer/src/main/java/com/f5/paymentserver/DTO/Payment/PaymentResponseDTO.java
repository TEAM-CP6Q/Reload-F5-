package com.f5.paymentserver.DTO.Payment;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class PaymentResponseDTO {
    private String result;
    private String message;
}
