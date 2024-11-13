package com.f5.chatserver.Service;

import com.f5.chatserver.DAO.MessageDAO;
import com.f5.chatserver.DTO.MessageDTO;
import org.springframework.stereotype.Service;

@Service
public class MessageServiceImpl implements MessageService {
    private final MessageDAO messageDAO;

    public MessageServiceImpl(MessageDAO messageDAO) {
        this.messageDAO = messageDAO;
    }

    @Override
    public void saveMessage(MessageDTO messageDTO) throws IllegalArgumentException {
        messageDAO.addMessage(messageDTO);
    }
}
