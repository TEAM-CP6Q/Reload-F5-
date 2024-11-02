package com.f5.authserver.DTO;

import lombok.*;

@Data
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KakaoAuthResponseDTO {
    private String accessToken;
}

