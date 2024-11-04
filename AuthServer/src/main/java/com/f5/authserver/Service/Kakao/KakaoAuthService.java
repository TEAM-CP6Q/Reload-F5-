package com.f5.authserver.Service.Kakao;

import com.f5.authserver.DTO.RegisterDTO;

import java.net.URISyntaxException;

public interface KakaoAuthService {
    String loginKakao(String authCode);
    String integrationAccount(String authCode) throws URISyntaxException;
    RegisterDTO registerKakao(String authCode) throws URISyntaxException;
}
