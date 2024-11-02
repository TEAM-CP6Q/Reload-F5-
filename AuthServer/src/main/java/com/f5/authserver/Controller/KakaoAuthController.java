package com.f5.authserver.Controller;

import com.f5.authserver.DTO.KakaoAuthRequestDTO;
import com.f5.authserver.DTO.KakaoAuthResponseDTO;
import com.f5.authserver.Service.Kakao.KakaoAuthService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth/login/kakao")
public class KakaoAuthController {

    private static final Logger logger = LoggerFactory.getLogger(KakaoAuthController.class);

    @Autowired
    private KakaoAuthService kakaoAuthService;

    @PostMapping("/token")
    public ResponseEntity<?> getKakaoToken(@RequestBody KakaoAuthRequestDTO request) {
        try {
            logger.info("Received Kakao auth code: {}", request.getCode());

            String accessToken = kakaoAuthService.getAccessToken(request.getCode());

            if (accessToken == null) {
                logger.error("Failed to obtain access token.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰 요청 실패");
            }

            logger.info("Successfully retrieved access token: {}", accessToken);
            KakaoAuthResponseDTO responseDTO = new KakaoAuthResponseDTO();
            responseDTO.setAccessToken(accessToken);
            // KakaoAuthResponseDTO를 통해 토큰을 응답으로 전달
            return ResponseEntity.ok(responseDTO);

        } catch (Exception e) {
            logger.error("Internal server error occurred during token processing", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
        }


    }
}

