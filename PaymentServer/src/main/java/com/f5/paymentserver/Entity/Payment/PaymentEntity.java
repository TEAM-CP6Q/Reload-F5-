package com.f5.paymentserver.Entity.Payment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long paymentId;

    @Column
    private Long productId;

    @Column
    private Long price;

    @Column
    private Long amount;

    @Column
    private String consumer;

    @Column
    private LocalDateTime createdOn;

    @Column(nullable = false)
    private Long totalPaymentId;
}

