package com.f5.authserver.Controller;

import com.f5.authserver.DTO.KakaoAuthRequestDTO;
import com.f5.authserver.DTO.KakaoAuthResponseDTO;
import com.f5.authserver.DTO.TestDTO;
import com.f5.authserver.DTO.UserKakaoDTO;
import com.f5.authserver.Entity.UserEntity;
import com.f5.authserver.JWT.JwtTokenUtil;
import com.f5.authserver.Repository.UserRepository;
import com.f5.authserver.Service.Kakao.KakaoAuthService;
import com.f5.authserver.Service.User.CustomUserDetailsService;
import com.f5.authserver.Service.User.CustomUserKakaoDetailsService;
import com.f5.authserver.Service.User.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.support.JstlUtils;

@RestController
@RequestMapping("/api/auth/kakao")
public class KakaoAuthController {
    private final AuthenticationManager authenticationManager;
    private final CustomUserKakaoDetailsService customUserKakaoDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;


    private static final Logger logger = LoggerFactory.getLogger(KakaoAuthController.class);

    private final KakaoAuthService kakaoAuthService;
    private final UserRepository userRepository;

    public KakaoAuthController(AuthenticationManager authenticationManager, CustomUserKakaoDetailsService customUserKakaoDetailsService, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil, UserService userService, KakaoAuthService kakaoAuthService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.customUserKakaoDetailsService = customUserKakaoDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userService = userService;
        this.kakaoAuthService = kakaoAuthService;
        this.userRepository = userRepository;
    }

//    @PostMapping("/token")
//    public ResponseEntity<?> getKakaoToken(@RequestBody KakaoAuthRequestDTO request) {
//        try {
//            logger.info("Received Kakao auth code: {}", request.getCode());
//
//            String accessToken = kakaoAuthService.getAccessToken(request.getCode());
//
//            if (accessToken == null) {
//                logger.error("Failed to obtain access token.");
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰 요청 실패");
//            }
//
//            logger.info("Successfully retrieved access token: {}", accessToken);
//            KakaoAuthResponseDTO responseDTO = new KakaoAuthResponseDTO();
//            responseDTO.setAccessToken(accessToken);
//            // KakaoAuthResponseDTO를 통해 토큰을 응답으로 전달
//            return ResponseEntity.ok(responseDTO);
//
//        } catch (Exception e) {
//            logger.error("Internal server error occurred during token processing", e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
//        }
//
//    }

    @PostMapping("/login")
    public ResponseEntity<?> getKakaoToken(@RequestBody KakaoAuthRequestDTO request) {
        try {
            logger.info("Received Kakao auth code: {}", request.getCode());

            String status = kakaoAuthService.getAccessToken(request.getCode());

            if (status.equals("회원가입 필요")) {
                logger.error("회원가입이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("회원가입 필요");
            }


            final UserDetails userDetails = customUserKakaoDetailsService.loadUserByUsername(status);
            final String token = jwtTokenUtil.generateToken(userDetails.getUsername());

            // UserEntity를 서비스 메서드를 통해 가져옴
            UserEntity loggedInUser = userService.getLoggedInUserEntity(status);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", loggedInUser);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Internal server error occurred during token processing", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserKakaoDTO userKakaoDTO) {
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail(userKakaoDTO.getEmail());
        userEntity.setPassword(passwordEncoder.encode(userKakaoDTO.getPassword()));
        userEntity.setKakao(userKakaoDTO.getKakao());
        userEntity.setUserId(passwordEncoder.encode(userKakaoDTO.getUserId()));
        userRepository.save(userEntity);

        return ResponseEntity.ok("저장 성공");

    }
}

