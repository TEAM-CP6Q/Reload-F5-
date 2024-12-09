package com.f5.test;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_product")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class OrderProductEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;    // Entity 아이디
    private Long productId;     // 상품 아이디
    private Long price;         // 상품 가격
    private Long amount;        // 상품 양
}