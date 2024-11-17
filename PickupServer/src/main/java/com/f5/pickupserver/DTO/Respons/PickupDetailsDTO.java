package com.f5.pickupserver.DTO.Respons;

import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PickupDetailsDTO {
    private String name;
    private String phone;
    private String email;
    private Long postalCode;
    private String roadNameAddress;
    private String detailedAddress;
    private Long pricePreview;
    private Long price;
    private Boolean payment;
    private Boolean pickupProgress;
    private Boolean accepted;
    private List<DetailsResponseDTO> details;
}
