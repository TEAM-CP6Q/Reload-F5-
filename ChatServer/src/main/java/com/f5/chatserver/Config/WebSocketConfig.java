package com.f5.chatserver.Config;

import com.f5.chatserver.Service.ChatManageService;
import com.f5.chatserver.WebSocket.CustomChannelInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final ChatManageService chatManageService;

    public WebSocketConfig(@Lazy ChatManageService chatManageService) {
        this.chatManageService = chatManageService;
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/chat")
                .setAllowedOrigins("http://127.0.0.1:3000",
                        "https:refresh-f5-server.o-r.kr",
                        "https://refresh-f5.store")
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(customChannelInterceptor());
    }

    @Bean
    @Lazy
    public CustomChannelInterceptor customChannelInterceptor() {
        return new CustomChannelInterceptor(chatManageService);
    }
}
