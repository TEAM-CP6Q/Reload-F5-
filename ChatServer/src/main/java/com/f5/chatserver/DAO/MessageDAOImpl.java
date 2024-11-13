package com.f5.chatserver.DAO;

import com.f5.chatserver.DTO.MessageDTO;
import com.f5.chatserver.Entity.MessageEntity;
import com.f5.chatserver.Repository.ChatRepository;
import com.f5.chatserver.Repository.MessageRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Transactional
public class MessageDAOImpl implements MessageDAO {
    private final MessageRepository messageRepository;
    private final ChatRepository chatRepository;

    public MessageDAOImpl(MessageRepository messageRepository, ChatRepository chatRepository) {
        this.messageRepository = messageRepository;
        this.chatRepository = chatRepository;
    }

    @Override
    public void addMessage(MessageDTO messageDTO) {
        try{
            MessageEntity messageEntity = new MessageEntity();
            messageEntity.setChatEntity(chatRepository.findByChatId(messageDTO.getChatId()));
            messageEntity.setContent(messageDTO.getContent());
            messageEntity.setSender(messageDTO.getSender());
            messageEntity.setSendTime(LocalDateTime.now());
            messageRepository.save(messageEntity);
        } catch (Exception e){
            throw new IllegalStateException("메세지 저장 실패");
        }
    }
}
