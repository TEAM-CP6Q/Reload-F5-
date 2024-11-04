package com.f5.authserver.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class AddressDTO {
    private String postalCode;
    private String roadNameAddress;
    private String detailedAddress;
}
