package com.f5.chatserver.Service;

import com.f5.chatserver.DTO.ChatDTO;
import com.f5.chatserver.DTO.MessageDTO;
import com.f5.chatserver.Entity.MessageEntity;
import org.springframework.web.socket.WebSocketSession;

import java.util.LinkedHashMap;
import java.util.List;

public interface ChatService {
    LinkedHashMap<Long, ChatDTO> findAllRoom();
    ChatDTO findChatId(Long chatId);
    ChatDTO createRoom(String email, String sender);
    List<ChatDTO> findUserChatAll(String email);
    <T> void sendMessage(Long chatId, T message);
}
