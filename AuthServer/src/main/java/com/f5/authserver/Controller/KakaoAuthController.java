package com.f5.authserver.Controller;

import com.f5.authserver.DTO.*;
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

import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.support.JstlUtils;

import static org.springframework.http.ResponseEntity.*;

@RestController
@RequestMapping("/api/auth/kakao")
public class KakaoAuthController {
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;


    private static final Logger logger = LoggerFactory.getLogger(KakaoAuthController.class);

    private final KakaoAuthService kakaoAuthService;
    private final UserRepository userRepository;

    public KakaoAuthController(AuthenticationManager authenticationManager, CustomUserDetailsService customUserDetailsService, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil, UserService userService, KakaoAuthService kakaoAuthService, UserRepository userRepository) {
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userService = userService;
        this.kakaoAuthService = kakaoAuthService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> getKakaoToken(@RequestBody KakaoAuthRequestDTO request) {
        try {
            logger.info("Received Kakao auth code: {}", request.getCode());

            String status = kakaoAuthService.loginKakao(request.getCode());

            if (status.equals("Need register")) {
                logger.error("회원가입이 필요합니다.");
                return status(404).body("회원가입 필요");
            } else if (status.equals("Need integration")) {
                return status(405).body("통합 필요");
            }

            // 정규 표현식 패턴 생성
            Pattern emailPattern = Pattern.compile("email: (\\S+)");
            Pattern userIdPattern = Pattern.compile("userId: (\\S+)");

            // Matcher를 사용하여 email 추출
            Matcher emailMatcher = emailPattern.matcher(status);
            String email = emailMatcher.find() ? emailMatcher.group(1) : "Not found";

            // Matcher를 사용하여 userId 추출
            Matcher userIdMatcher = userIdPattern.matcher(status);
            String password = userIdMatcher.find() ? userIdMatcher.group(1) : "Not found";

            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));

            final UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);
            final String token = jwtTokenUtil.generateToken(userDetails.getUsername());

            // UserEntity를 서비스 메서드를 통해 가져옴
            UserEntity loggedInUser = userService.getLoggedInUserEntity(email);

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", loggedInUser);
            return ok(response);

        } catch (Exception e) {
            logger.error("Internal server error occurred during token processing", e);
            return status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 에러 발생");
        }
    }

    @PatchMapping("/integration")
    public ResponseEntity<?> integrationAccount(@RequestBody KakaoAuthRequestDTO request) {
        try{
            logger.info("Received Kakao auth code: {}", request.getCode());
            String status = kakaoAuthService.integrationAccount(request.getCode());
            return ok(status);
        } catch (URISyntaxException e) {
            return status(404).body(e);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody KakaoAuthRequestDTO request) {
        try {
            RegisterDTO registerDTO = kakaoAuthService.registerKakao(request.getCode());
            UserDTO savedUser = userService.registerUser(registerDTO);
            return ok("Email: " + savedUser.getEmail() + " 회원가입 성공");
        } catch (URISyntaxException e) {
            throw new IllegalArgumentException("회원가입 실패" + e.getMessage());
        }
    }
}

