package com.f5.pickupmanagementserver.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DetailsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @ManyToOne
    @JoinColumn(name = "pickup_id", referencedColumnName = "pickupId", nullable = false)
    private PickupListEntity pickupList;

    @Column(nullable = false)
    private String wasteId;

    @Column
    private String weight;

    @Column(nullable = false)
    private Long pricePreview;

    @Column
    private Long price;
}
