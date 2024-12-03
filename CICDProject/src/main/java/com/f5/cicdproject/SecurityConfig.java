package com.f5.cicdproject;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health",
                                "/cicd/").permitAll()  // 인증 없이 허용
                        .anyRequest().authenticated()                    // 다른 요청은 인증 필요
                )
                .csrf(AbstractHttpConfigurer::disable);  // 필요 시 CSRF 비활성화
        return http.build();
    }
}

