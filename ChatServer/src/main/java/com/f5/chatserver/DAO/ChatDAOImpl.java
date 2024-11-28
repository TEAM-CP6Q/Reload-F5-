package com.f5.chatserver.DAO;

import com.f5.chatserver.DTO.ChatDTO;
import com.f5.chatserver.Entity.ChatEntity;
import com.f5.chatserver.Repository.ChatRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Component
public class ChatDAOImpl implements ChatDAO {
    private final ChatRepository chatRepository;

    public ChatDAOImpl(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Override
    public ChatDTO createChat(String email, String sender) {
        try{
            ChatEntity chatEntity = new ChatEntity();
            chatEntity.setEmail(email);
            chatEntity.setSender(sender);
            chatRepository.save(chatEntity);
            ChatDTO chatDTO = new ChatDTO();
            chatDTO.setChatId(chatEntity.getChatId());
            chatDTO.setEmail(email);
            chatDTO.setSender(sender);
            return chatDTO;
        } catch (Exception e) {
            throw new IllegalStateException("방 생성 실패");
        }
    }

    @Override
    public LinkedHashMap<Long, String> findAllChat() {
        List<ChatEntity> chatEntities = chatRepository.findAll();
        LinkedHashMap<Long, String> chatMap = new LinkedHashMap<>();
        try {
            for (ChatEntity chatEntity : chatEntities) {
                chatMap.put(chatEntity.getChatId(), chatEntity.getEmail());
            }
        } catch (Exception e) {
            throw new IllegalStateException("채팅방 리스트 로드에 실패");
        }
        return chatMap;
    }

    @Override
    public List<ChatDTO> getAllUserChat(String email) {
        List<ChatEntity> chatEntities = chatRepository.findAllByEmail(email);
        List<ChatDTO> chatDTOList = new ArrayList<>();
        try {
            for (ChatEntity chatEntity : chatEntities) {
                ChatDTO chatDTO = new ChatDTO();
                chatDTO.setChatId(chatEntity.getChatId());
                chatDTO.setEmail(chatEntity.getEmail());
                chatDTOList.add(chatDTO);
            }
        } catch (Exception e) {
            throw new IllegalStateException("유저 채팅 리스트 로드 실패");
        }
        return chatDTOList;
    }
}
