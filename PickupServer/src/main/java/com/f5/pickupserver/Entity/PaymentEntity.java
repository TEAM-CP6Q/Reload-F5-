package com.f5.pickupserver.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PaymentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "pickup_id", referencedColumnName = "pickupId", nullable = false)
    @OneToOne
    private PickupListEntity pickupListEntity;

    @Column(length = 100)
    private String merchantUid;  // 주문번호
}
