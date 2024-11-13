package com.f5.eurekaserver.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 이 부분에서 /eureka/** 경로를 제외하거나 정적 리소스 핸들링을 특정 경로로만 제한합니다.
        registry.addResourceHandler("/static/**").addResourceLocations("classpath:/static/");
    }
}
