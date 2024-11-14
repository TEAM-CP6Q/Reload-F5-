package com.f5.gatewayserver.JWT;

import lombok.RequiredArgsConstructor;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        // JWT 검증 로직
        String path = exchange.getRequest().getPath().toString();

        // JWT 검증을 생략할 경로 설정
        if (path.startsWith("/api/auth/login") ||
                path.startsWith("/api/auth/register") ||
                path.startsWith("/api/auth/register/exist-email") ||
                path.startsWith("/api/auth/admin/login") ||
                path.startsWith("/api/get-secret") ||
                path.startsWith("/api/auth/login/kakao/token") ||
                path.startsWith("/api/auth/admin/register") ||
                path.startsWith("/api/auth/kakao/login") ||
                path.startsWith("/api/auth/kakao/register") ||
                path.startsWith("/api/auth/kakao/integration") ||
                path.startsWith("/api/account/user-list") ||
                path.startsWith("/api/auth/user-info") ||
                path.startsWith("/api/auth/email") ||
                path.startsWith("/api/pickup/waste/type-list") ||
                path.startsWith("/api/pickup/update-location") ||
                path.startsWith("/api/pickup/get-location") ||
                path.startsWith("/api/account/designer/get-designer") ||
                path.startsWith("/api/account/designer/all-designer")){
            return chain.filter(exchange);  // 위의 경로는 JWT 검증 생략
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Invalid JWT Token for path 1: " + path); // 로그 추가
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "JWT Token is missing");
        }

        String token = authHeader.substring(7);
        if (!jwtUtil.isTokenValid(token)) {
            System.out.println("Invalid JWT Token for path 2: " + path); // 로그 추가
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT Token");
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1; // 필터 우선순위 설정
    }
}
