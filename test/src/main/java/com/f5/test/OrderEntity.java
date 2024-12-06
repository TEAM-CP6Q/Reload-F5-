package com.f5.test;

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
    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn
    private List<OrderProductEntity> orderProductList;
}
