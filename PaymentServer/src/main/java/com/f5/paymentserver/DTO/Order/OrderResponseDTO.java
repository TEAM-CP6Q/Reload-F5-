package com.f5.paymentserver.DTO.Order;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrderResponseDTO {
    private String result;  // 결과값
    private Long orderId;   // 주문 번호
    private String merchantUid;
}
