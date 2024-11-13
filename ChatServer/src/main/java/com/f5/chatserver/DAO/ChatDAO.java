package com.f5.chatserver.DAO;

import com.f5.chatserver.DTO.ChatDTO;

import java.util.LinkedHashMap;
import java.util.List;

public interface ChatDAO {
    ChatDTO createChat(String email);
    LinkedHashMap<Long, String> findAllChat();
    List<ChatDTO> getAllUserChat(String email);
}
