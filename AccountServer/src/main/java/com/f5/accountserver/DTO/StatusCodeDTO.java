package com.f5.accountserver.DTO;

import lombok.*;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StatusCodeDTO {
    private Long Code;
    private String Msg;
}
