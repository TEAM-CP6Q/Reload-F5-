package com.f5.chatserver.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class StatusCodeDTO {
    private Long code;
    private String msg;
}
