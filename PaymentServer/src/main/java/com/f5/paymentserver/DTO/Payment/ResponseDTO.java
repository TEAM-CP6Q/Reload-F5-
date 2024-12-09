package com.f5.paymentserver.DTO.Payment;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ResponseDTO {
    private String result;
    private String message;
    private Object data;
}
