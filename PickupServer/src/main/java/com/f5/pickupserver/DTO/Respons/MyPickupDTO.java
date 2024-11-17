package com.f5.pickupserver.DTO.Respons;

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
    private Boolean accepted;
}
