package com.f5.pickupmanagementserver.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests

                                // POST 요청만 허용
                                .requestMatchers(HttpMethod.POST,
                                        "/api/pickup/new-pickup")
                                .permitAll()

                                // GET 요청만 허용
                                .requestMatchers(HttpMethod.GET,
                                        "/api/pickup/waste/type-list",
                                        "/api/pickup/my-pickup/**",
                                        "/api/pickup/get-details",
                                        "/api/pickup/get-all-pickups")
                                .permitAll()

                                .requestMatchers(HttpMethod.PATCH,
                                        "/api/pickup/update-pickup")
                                .permitAll()

                                .requestMatchers(HttpMethod.DELETE,
                                        "/api/pickup/delete-pickup")
                                .permitAll()
                                // 그 외의 요청은 인증 필요
                                .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable); // CSRF 보호 비활성화
        return http.build();
    }
}
