package com.f5.productserver.Config;

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
                                        "/api/product/add-product",
                                        "api/product/add-product-category")
                                .permitAll()

                                // GET 요청만 허용
                                .requestMatchers(HttpMethod.GET,
//                                        "/api/account/search-account/**",
//                                        "/api/account/user-list",
//                                        "/api/account/designer/get-designer",
//                                        "/api/account/designer/all-designer",
                                        "/api/product/**")
                                .permitAll()

                                // PATCH 요청만 허용
                                .requestMatchers(HttpMethod.PATCH,
                                        "/api/product/update-category")
                                .permitAll()

                                // DELETE 요청만 허용
                                .requestMatchers(HttpMethod.DELETE,
                                        "/api/product/delete-product/**",
                                        "/api/product/delete-category/**")
                                .permitAll()

                                // 그 외의 요청은 인증 필요
                                .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable); // CSRF 보호 비활성화
        return http.build();
    }
}
