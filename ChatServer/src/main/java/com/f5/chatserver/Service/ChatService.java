package com.f5.chatserver.Service;

import com.f5.chatserver.DTO.ChatDTO;
import org.springframework.web.socket.WebSocketSession;

import java.util.LinkedHashMap;
import java.util.List;

public interface ChatService {
    LinkedHashMap<Long, ChatDTO> findAllRoom();
    ChatDTO findChatId(Long chatId);
    ChatDTO createRoom(String email);
    List<ChatDTO> findUserChatAll(String email);
    <T> void sendMessage(Long chatId, T message);
}
