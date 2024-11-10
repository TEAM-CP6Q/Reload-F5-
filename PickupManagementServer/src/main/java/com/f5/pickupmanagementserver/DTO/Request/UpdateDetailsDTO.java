package com.f5.pickupmanagementserver.DTO.Request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class UpdateDetailsDTO {
    private String wasteId;
    private Long price;
}
