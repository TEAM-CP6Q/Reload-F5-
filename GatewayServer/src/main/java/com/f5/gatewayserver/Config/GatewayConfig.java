package com.f5.gatewayserver.Config;

import com.f5.gatewayserver.JWT.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.filter.GlobalFilter;

@Configuration
@RequiredArgsConstructor
public class GatewayConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public GlobalFilter jwtFilter() {
        return jwtAuthenticationFilter;  // JwtAuthenticationFilter는 GlobalFilter를 구현해야 합니다.
    }
}
