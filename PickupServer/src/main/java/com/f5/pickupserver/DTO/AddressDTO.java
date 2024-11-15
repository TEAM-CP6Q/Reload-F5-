package com.f5.pickupserver.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class AddressDTO {
    private String name;
    private String email;
    private String phone;
    private Long postalCode;
    private String roadNameAddress;
    private String detailedAddress;
}
