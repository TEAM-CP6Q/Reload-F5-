package com.f5.pickupmanagementserver.DTO.Request;

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
