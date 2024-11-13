package com.f5.pickupmanagementserver.Entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class PickupListEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pickupId;

    @Column
    private String notes;

    @Column(nullable = false)
    private Long pricePreview;

    @Column
    private Long price;

    @Column(nullable = false)
    private Boolean payment;

    @Column(nullable = false)
    private LocalDateTime pickupDate;

    @Column(nullable = false)
    private LocalDate requestDate;

    @Column(nullable = false)
    private Boolean pickupProgress;

    @Column
    private Boolean accepted;
}
