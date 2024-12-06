package com.f5.test;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrderDTO {
    private Long id;    // Order 아이디
    private String consumer;   // 구매자
    private Long totalPrice;    // 총 가격
    private LocalDateTime createdOn;
    private List<OrderProductDTO> orderProductList;
}