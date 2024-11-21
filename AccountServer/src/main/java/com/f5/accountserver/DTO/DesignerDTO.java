package com.f5.accountserver.DTO;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DesignerDTO {
    private Long id;
    private String image;
    private String name;
    private String email;
    private String phone;
    private String career;
    private String category;
    private String pr;
    private Boolean empStatus;
}
