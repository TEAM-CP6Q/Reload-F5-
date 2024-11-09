package com.f5.pickupmanagementserver.DTO.Respons;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class DetailsResponseDTO {
    private String wasteId;
    private String wasteName;
    private String weight;
    private Long pricePreview;
    private Long price;
}
