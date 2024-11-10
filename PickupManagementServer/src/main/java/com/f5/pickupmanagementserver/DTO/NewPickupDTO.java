package com.f5.pickupmanagementserver.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class NewPickupDTO {
    private String notes;
    private Long pricePreview;
    private String pickupDate;
}
