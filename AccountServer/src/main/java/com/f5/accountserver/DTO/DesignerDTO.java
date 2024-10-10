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
    private String name;
    private String image;
}
