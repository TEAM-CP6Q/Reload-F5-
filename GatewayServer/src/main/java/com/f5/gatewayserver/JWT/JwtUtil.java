package com.f5.gatewayserver.JWT;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import javax.annotation.PostConstruct;
import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api")
@Component
public class JwtUtil {

    private SecretKey secretKey;
    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate = new RestTemplate();

    public JwtUtil(DiscoveryClient discoveryClient) {
        this.discoveryClient = discoveryClient;
    }

    // 비밀 키를 AUTH-SERVER에서 가져오는 메서드
    private void fetchSecretKeyFromAuthServer() {
        List<ServiceInstance> instances = discoveryClient.getInstances("AUTH-SERVER");
        if (instances == null || instances.isEmpty()) {
            throw new IllegalStateException("No AUTH-SERVER instances available");
        }
        // AUTH-SERVER의 URI를 가져와서 요청
        String authServerUri = instances.get(0).getUri().toString();
        String secretKeyString = restTemplate.getForObject(authServerUri + "/api/auth/key", String.class);

        // Base64 디코딩 후 SecretKey로 변환
        byte[] decodedKey = Base64.getDecoder().decode(secretKeyString);
        this.secretKey = Keys.hmacShaKeyFor(decodedKey);
    }

    // 초기화 메서드에서 호출하여 secretKey 설정
    @PostConstruct
    public void initializeSecretKey() {
        if (this.secretKey == null) {
            fetchSecretKeyFromAuthServer();
        }
    }

    @PostMapping("/get-secret")
    public void updateSecretKey() {
        fetchSecretKeyFromAuthServer();
    }

    // JWT 토큰에서 클레임 추출
    public Claims extractClaims(String token) {
        initializeSecretKey();
        return Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // JWT 토큰 검증
    public boolean isTokenValid(String token) {
        try {
            initializeSecretKey();
            Claims claims = extractClaims(token);

            // 만료 시간 체크
            return !claims.getExpiration().before(new Date());
        } catch (JwtException | IllegalArgumentException e) {
            return false; // 토큰이 유효하지 않으면 false 반환
        }
    }

    @GetMapping("/home")
    public String homePage(HttpServletRequest request){
        return "home";
    }
}
