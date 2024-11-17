package com.f5.pickupserver.DTO;

import lombok.*;

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
