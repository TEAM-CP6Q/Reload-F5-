package com.f5.pickupmanagementserver.DTO.Request;

import com.f5.pickupmanagementserver.DTO.Respons.DetailsResponseDTO;
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
