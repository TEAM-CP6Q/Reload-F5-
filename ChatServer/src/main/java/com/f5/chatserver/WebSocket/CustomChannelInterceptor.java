package com.f5.chatserver.WebSocket;

import com.f5.chatserver.Service.ChatManageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Slf4j
@Component
public class CustomChannelInterceptor implements ChannelInterceptor {
    private final ChatManageService chatManageService;

    public CustomChannelInterceptor(ChatManageService chatManageService) {
        this.chatManageService = chatManageService;
    }

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.SUBSCRIBE.equals(accessor.getCommand())) {
            String destination = accessor.getDestination();
            String sessionId = accessor.getSessionId();

            if ("/topic/admin/new-room".equals(destination)) {
                System.out.println("Subscription detected for session: " + sessionId);

                // 메시지를 구독 경로로 전송
                chatManageService.loadDetails();
                log.info("일단 됨");
            }

            if (Objects.requireNonNull(destination).startsWith("/topic/chat/")){
                String[] parts = destination.split("/");
                if (parts.length == 4) {
                    Long chatId = Long.valueOf(parts[3].trim());
                    chatManageService.sendMessageList(chatId);
                }
            }
        }
        return message;
    }
}
