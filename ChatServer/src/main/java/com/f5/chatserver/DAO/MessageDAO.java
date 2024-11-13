package com.f5.chatserver.DAO;

import com.f5.chatserver.DTO.MessageDTO;

public interface MessageDAO {
    void addMessage(MessageDTO messageDTO);
}
