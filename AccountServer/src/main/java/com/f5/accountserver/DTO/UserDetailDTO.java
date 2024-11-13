package com.f5.accountserver.DTO;

import lombok.*;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDetailDTO {
    private Long id;
    private String name;
    private Long postalCode;
    private String roadNameAddress;
    private String detailedAddress;
    private String phoneNumber;
}
