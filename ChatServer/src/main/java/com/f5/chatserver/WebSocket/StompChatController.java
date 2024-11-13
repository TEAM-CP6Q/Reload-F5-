package com.f5.chatserver.WebSocket;

import com.f5.chatserver.DTO.ChatDTO;
import com.f5.chatserver.DTO.MessageDTO;
import com.f5.chatserver.Service.ChatService;
import com.f5.chatserver.Service.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Slf4j
@RequiredArgsConstructor
@Controller
@Transactional
public class StompChatController {

    private final ObjectMapper objectMapper;
    private final ChatService chatService;
    private final MessageService messageService;
    private final SimpMessagingTemplate messagingTemplate; // STOMP 메시지 전송을 위한 템플릿

    @MessageMapping("/chat") // 클라이언트에서 /app/chat로 보낸 메시지를 처리
    public void handleMessage(MessageDTO messageDTO) throws Exception {
        // 메시지 로깅
        log.info("Received message: {}", messageDTO);

        // 메시지 저장
        //messageService.saveMessage(messageDTO);

        // 채팅방 ID를 통해 채팅 정보를 가져옴
        ChatDTO chatDTO = chatService.findChatId(messageDTO.getChatId());

        // 메시지를 해당 채팅방의 모든 구독자에게 전송
        String destination = "/topic/chat/" + messageDTO.getChatId();
        messagingTemplate.convertAndSend("/topic/admin/new-room", messageDTO);
        messagingTemplate.convertAndSend(destination, messageDTO);
    }
}
