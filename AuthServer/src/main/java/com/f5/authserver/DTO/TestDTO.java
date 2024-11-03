package com.f5.authserver.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class TestDTO {
    private String email;
    private String userId;
}
