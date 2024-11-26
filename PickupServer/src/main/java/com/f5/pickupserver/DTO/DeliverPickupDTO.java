package com.f5.pickupserver.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class DeliverPickupDTO {
    private Long pickupId;
    private AddressDTO address;
}
