package com.f5.authserver.Config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.authorization.AuthorizationDecision;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
                                // Key 요청은 특정 IP에서만 허용 (127.0.0.1은 localhost)
                                .requestMatchers(HttpMethod.GET, "/api/auth/key")
                                .access((authenticationSupplier, object) -> {
                                    // Supplier에서 Authentication 객체를 가져옴
                                    Authentication authentication = authenticationSupplier.get();
                                    String ipAddress = object.getRequest().getRemoteAddr();

                                    if (ipAddress.equals("3.37.122.192") || ipAddress.equals("121.182.42.114")) {
                                        return new AuthorizationDecision(true); // 허용
                                    } else if (authentication != null && authentication.isAuthenticated()) {
                                        return new AuthorizationDecision(true); // 인증된 경우 허용
                                    } else {
                                        return new AuthorizationDecision(false); // 그 외의 경우 접근 거부
                                    }
                                })

                                // /actuator/health와 같은 관리 엔드포인트는 인증 없이 접근 허용
                                .requestMatchers(HttpMethod.GET, "/actuator/health", "/actuator/info")
                                .permitAll()

                                // GET 요청 허용
                                .requestMatchers(HttpMethod.GET,
                                        "/api/auth/register/exist-email/**",
                                        "/api/auth/user-info/**",
                                        "/api/auth/key",
                                        "/api/auth/email/**")
                                .permitAll()

                                // POST 요청 허용
                                .requestMatchers(HttpMethod.POST,
                                        "/api/auth/login",
                                        "/api/auth/register",
                                        "/api/auth/admin/register",
                                        "/api/auth/admin/login",
                                        "/api/auth/login/kakao/token",
                                        "/api/auth/kakao/login",
                                        "/api/auth/kakao/register",
                                        "/api/auth/register/deliver")
                                .permitAll()

                                // PATCH 요청 허용
                                .requestMatchers(HttpMethod.PATCH,
                                        "/api/auth/kakao/integration")
                                .permitAll()

                                .requestMatchers(HttpMethod.DELETE,
                                        "/api/auth/withdraw")
                                .permitAll()

                                // 그 외의 요청은 인증 필요
                                .anyRequest().authenticated()
                )
                .csrf(AbstractHttpConfigurer::disable); // CSRF 비활성화

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}