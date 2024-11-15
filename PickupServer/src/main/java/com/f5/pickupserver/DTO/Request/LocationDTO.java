package com.f5.pickupserver.DTO.Request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocationDTO {
    private Long pickupId;
    private Double latitude;
    private Double longitude;
}
