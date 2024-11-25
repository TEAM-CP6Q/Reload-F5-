package com.f5.chatserver.Config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // STOMP 메시징 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // 클라이언트에서 구독하는 메시지 브로커 경로 설정
        config.enableSimpleBroker("/topic", "/queue"); // 메시지 브로커가 처리하는 경로
        config.setApplicationDestinationPrefixes("/app"); // 클라이언트가 메시지를 보낼 때 경로
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // STOMP 엔드포인트 설정
        registry.addEndpoint("/ws/chat") // 엔드포인트 URL
                .setAllowedOrigins("http://127.0.0.1:3000",
                        "http://3.37.122.192:8000",
                        "http://15.165.174.146:3000",
                        "http://localhost:8000",
                        "https://refresh-f5.store")  // 모든 출처 허용
                .withSockJS();           // SockJS 지원 활성화 (웹소켓 미지원 브라우저를 위한 대체 옵션)
    }
}