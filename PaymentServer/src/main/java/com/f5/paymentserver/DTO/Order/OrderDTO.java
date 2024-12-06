package com.f5.paymentserver.DTO.Order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
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
    private String merchantUid;  // 주문번호
    private List<OrderProductDTO> orderProductList;
}
