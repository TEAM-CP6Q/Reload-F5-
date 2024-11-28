package com.f5.pickupserver.DTO.Respons;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    private LocalDateTime pickupDate;
    private Boolean pickupProgress;
    private Long pricePreview;
    private Long price;
    private Boolean accepted;
}
