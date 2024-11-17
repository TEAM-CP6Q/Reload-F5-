package com.f5.pickupserver.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AddressEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "pickup_id", referencedColumnName = "pickupId", nullable = false)
    private PickupListEntity pickupList;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private Long postalCode;

    @Column(nullable = false)
    private String roadNameAddress;

    @Column(nullable = false)
    private String detailedAddress;
}
