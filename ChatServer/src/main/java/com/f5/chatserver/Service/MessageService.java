package com.f5.chatserver.Service;

import com.f5.chatserver.DTO.MessageDTO;

public interface MessageService {
    void saveMessage(MessageDTO messageDTO);
}
