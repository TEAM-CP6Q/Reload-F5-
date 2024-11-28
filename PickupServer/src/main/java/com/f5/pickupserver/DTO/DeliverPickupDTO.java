package com.f5.pickupserver.DTO;

import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class DeliverPickupDTO {
    private Long pickupId;
    private LocalDateTime pickupDate;
    private AddressDTO address;
}
