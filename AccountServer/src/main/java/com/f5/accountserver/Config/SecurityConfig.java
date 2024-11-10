package com.f5.accountserver.Config;

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
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                // POST 요청만 허용
                                .requestMatchers(HttpMethod.POST,
                                        "/api/account/add-details",
                                        "/api/account/designer/add-designer")
                                .permitAll()

                                // GET 요청만 허용
                                .requestMatchers(HttpMethod.GET,
                                        "/api/account/search-account/**",
                                        "/api/account/user-list")
                                .permitAll()

                                // PATCH 요청만 허용
                                .requestMatchers(HttpMethod.PATCH,
                                        "/api/account/update-account")
                                .permitAll()

                                // DELETE 요청만 허용
                                .requestMatchers(HttpMethod.DELETE,
                                        "/api/account/withdraw/**",
                                        "/api/account/designer/remove-designer/**")
                                .permitAll()

                                // 그 외의 요청은 인증 필요
                                .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable); // CSRF 보호 비활성화
        return http.build();
    }
}
