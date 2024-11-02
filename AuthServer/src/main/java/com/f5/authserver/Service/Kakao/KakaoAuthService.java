package com.f5.authserver.Service.Kakao;

public interface KakaoAuthService {
    String getAccessToken(String authCode);
}
