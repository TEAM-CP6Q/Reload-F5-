package com.f5.pickupmanagementserver.DTO.Respons;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusCodeDTO {
    private Long code;
    private String msg;
}
