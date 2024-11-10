package com.f5.pickupmanagementserver.DTO.Respons;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class MyPickupDTO {
    private Long pickupId;
    private LocalDate requestDate;
    private Boolean payment;
    private Boolean pickupProgress;
    private Long pricePreview;
    private Long price;
}
