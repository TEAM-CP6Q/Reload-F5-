package com.f5.pickupserver.DTO.Request;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class UpdatePickupDTO {
    private Long pickupId;
    private Long price;
    private Boolean payment;
    private Boolean pickupProgress;
    private Boolean accepted;
    private List<UpdateDetailsDTO> details;
}
