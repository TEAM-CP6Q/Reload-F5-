package com.f5.gatewayserver.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebFluxSecurity
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http
                .authorizeExchange(exchanges -> exchanges
                        // GET 요청 허용
                        .pathMatchers(HttpMethod.GET,
                                "/api/auth/register/exist-username/**",
                                "/api/account/search-account/**",
                                "/api/auth/user-info/**",
                                "/api/account/dormant-accounts",
                                "/api/auth/dormant-accounts").permitAll()

                        // POST 요청 허용
                        .pathMatchers(HttpMethod.POST,
                                "/api/auth/login",
                                "/api/auth/register",
                                "/api/auth/admin/login").permitAll()

                        // PATCH 요청 허용
                        .pathMatchers(HttpMethod.PATCH,
                                "/api/account/update-account",
                                "/api/auth/withdraw").permitAll()

                        .anyExchange().authenticated() // 그 외의 요청은 인증 필요
                )
                .csrf(ServerHttpSecurity.CsrfSpec::disable); // CSRF 비활성화

        return http.build();
    }

    // CORS 설정 추가 (도메인 제한 걸어버림. 이거만 있을 때엔 포스트맨은 먹히긴 함. 프론트에서 실험 좀 해봐야 할 듯)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://127.0.0.1:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.addAllowedHeader("*");
        configuration.addAllowedOriginPattern("*");
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}