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
                path.startsWith("/api/auth/register/exist-username") ||
                path.startsWith("/api/auth/admin/login") ||
                path.startsWith("/api/account/dormant-accounts") ||
                path.startsWith("/api/auth/dormant-accounts")) {
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

//    이거 밑에는 도메인 단에서 아예 제한 거는 코드 포스트맨도 안먹힘
//    private final JwtUtil jwtUtil;
//    private static final List<String> ALLOWED_ORIGINS = Arrays.asList("http://121.182.42.161", "http://allowed-domain2.com");
//
//    @Override
//    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
//        // 도메인 검증 로직
//        String origin = exchange.getRequest().getHeaders().getFirst(HttpHeaders.ORIGIN);
//        if (origin != null && !ALLOWED_ORIGINS.contains(origin)) {
//            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Origin not allowed");
//        }
//
//        // JWT 검증 로직
//        String path = exchange.getRequest().getPath().toString();
//        if (path.equals("/api/auth/login") || path.equals("/api/auth/register")) {
//            return chain.filter(exchange);  // 로그인/회원가입 경로는 JWT 검증 생략
//        }
//
//        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
//        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "JWT Token is missing");
//        }
//
//        String token = authHeader.substring(7);
//        if (!jwtUtil.isTokenValid(token)) {
//            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid JWT Token");
//        }
//
//        return chain.filter(exchange);
//    }
//
//    @Override
//    public int getOrder() {
//        return -1; // 필터 우선순위 설정
//    }
}
