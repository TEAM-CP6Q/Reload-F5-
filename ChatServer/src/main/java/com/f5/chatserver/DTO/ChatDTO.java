package com.f5.chatserver.DTO;

import com.f5.chatserver.Service.ChatService;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ChatDTO {
    private Long chatId;
    private String email;
    private String sender;

    // 클라이언트의 행동을 처리하는 메서드
    public void handleActions(MessageDTO messageDTO, ChatService chatService) {
        // 모든 클라이언트에게 메시지 전송
        sendMessage(messageDTO, chatService);
    }

    // 채팅방에 있는 모든 클라이언트에게 메시지 전송
    private <T> void sendMessage(T message, ChatService chatService) {
        chatService.sendMessage(chatId, message);
        // 채팅방 ID를 기준으로 해당 경로로 메시지를 전송 (STOMP 방식)
    }
}
