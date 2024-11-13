package com.f5.pickupmanagementserver.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WasteTypeDTO {
    private String id;
    private String type;
    private String description;
    private Long price;
}
