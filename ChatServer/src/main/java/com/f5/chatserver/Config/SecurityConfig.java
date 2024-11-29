package com.f5.chatserver.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정 추가
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                // POST 요청만 허용
                                .requestMatchers(HttpMethod.POST,
                                        "/api/chat/create-chat")
                                .permitAll()

                                // GET 요청만 허용
                                .requestMatchers(HttpMethod.GET,
                                        "/api/chat/all",
                                        "/api/chat/user-chats")
                                .permitAll()

                                // WebSocket 및 API 경로에 대한 모든 요청 허용
                                .requestMatchers("/ws/chat/**",
                                        "/api/chat/**").permitAll()

                                // 그 외의 요청은 인증 필요
                                .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable); // CSRF 보호 비활성화
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://127.0.0.1:3000",
                "https://refresh-f5-server.o-r.kr",
                "https://refresh-f5.store"
        )); // 허용할 Origin 설정
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS")); // 허용할 HTTP 메서드 설정

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration); // 모든 경로에 대해 CORS 설정 적용
        return source;
    }
}
