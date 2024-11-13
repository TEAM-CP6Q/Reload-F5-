package com.f5.eurekaserver.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .authorizeHttpRequests(authorizeRequests ->
                        authorizeRequests
                                .requestMatchers("/eureka/**").permitAll()  // 모든 요청을 허용
                                .anyRequest().permitAll()
                )
                .csrf(csrf -> csrf.disable())  // CSRF 비활성화
                .httpBasic(withDefaults());  // HTTP Basic 인증 활성화

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.builder()
                .username("admin")
                .password("{noop}1234")  // {noop}을 추가하여 비밀번호가 인코딩되지 않도록 설정
                .roles("USER")
                .build();
        return new InMemoryUserDetailsManager(user);
    }
}
