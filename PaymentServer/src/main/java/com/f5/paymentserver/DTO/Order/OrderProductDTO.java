package com.f5.paymentserver.DTO.Order;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrderProductDTO {
    private Long id;    // Entity 아이디
    private Long productId;     // 상품 아이디
    private Long price;         // 상품 가격
    private Long amount;        // 상품 양
}
