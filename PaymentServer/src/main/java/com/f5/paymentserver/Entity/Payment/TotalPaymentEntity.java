package com.f5.paymentserver.Entity.Payment;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "total_payment")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class TotalPaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String consumer;

    @Column
    private Long totalPrice;

    @Column
    private LocalDateTime createdOn;

    @Column
    private String payUniqId; // 결제 고유 번호

    public void updateDateTime(LocalDateTime dateTime){
        this.createdOn = dateTime;
    }
}

