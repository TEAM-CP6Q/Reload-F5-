package com.f5.paymentserver.Entity.Payment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;    // Order 아이디
    private String consumer;   // 구매자
    private Long totalPrice;    // 총 가격
    private LocalDateTime createdOn;
    private String merchantUid;  // 주문번호
    @OneToMany(cascade = CascadeType.ALL)   // 부모테이블 삭제시 연결된 자식 데이터도 삭제
    @JoinColumn
    private List<OrderProductEntity> orderProductList;
}
