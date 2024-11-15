package com.f5.pickupserver.DTO.Respons;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class PickupInfoMsgDTO {
    private Long pickupId;
    private String name;
    private String email;
}
