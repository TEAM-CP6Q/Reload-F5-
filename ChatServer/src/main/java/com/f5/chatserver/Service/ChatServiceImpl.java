package com.f5.chatserver.Service;

import com.f5.chatserver.DAO.ChatDAO;
import com.f5.chatserver.DTO.ChatDTO;
import com.f5.chatserver.Entity.ChatEntity;
import com.f5.chatserver.Repository.ChatRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.io.IOException;
import java.util.*;

import org.springframework.messaging.simp.SimpMessagingTemplate;

@Slf4j
@RequiredArgsConstructor
@Service
public class ChatServiceImpl implements ChatService {
    private final ObjectMapper objectMapper;
    private final ChatDAO chatDAO;
    private LinkedHashMap<Long, ChatDTO> chatRooms = new LinkedHashMap<>();
    private final ChatRepository chatRepository;
    private final SimpMessagingTemplate messagingTemplate; // STOMP 메시지 전송 템플릿

    @PostConstruct
    private void init() {
        chatRooms = new LinkedHashMap<>();
        List<ChatEntity> chatEntities = chatRepository.findAll();
        for (ChatEntity chatEntity : chatEntities) {
            chatRooms.put(chatEntity.getChatId(), ChatDTO.builder()
                    .chatId(chatEntity.getChatId())
                    .email(chatEntity.getEmail())
                    .build());
        }
    }

    @Override
    public LinkedHashMap<Long, ChatDTO> findAllRoom() throws IllegalStateException {
        return chatRooms;
    }

    @Override
    public ChatDTO findChatId(Long chatId) {
        return chatRooms.get(chatId);
    }

    @Override
    public ChatDTO createRoom(String email, String sender) {
        try {
            ChatDTO chatDTO = chatDAO.createChat(email, sender);
            chatRooms.put(chatDTO.getChatId(), chatDTO);
            messagingTemplate.convertAndSend("/topic/admin/new-room", chatDTO);
            return chatDTO;
        } catch (Exception e) {
            throw new IllegalStateException("채팅방 생성 실패");
        }
    }

    @Override
    public List<ChatDTO> findUserChatAll(String email) {
        try {
            List<ChatDTO> primal = chatDAO.getAllUserChat(email);
            List<ChatDTO> response = new ArrayList<>();
            for (ChatDTO chatDTO : primal) {
                response.add(chatRooms.get(chatDTO.getChatId()));
            }
            return response;
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    // STOMP 메시지 전송 방식
    @Override
    public <T> void sendMessage(Long chatId, T message) {
        try {
            String destination = "/topic/chat/" + chatId; // 구독 경로 생성
            messagingTemplate.convertAndSend(destination, message); // STOMP로 메시지 전송
        } catch (Exception e) {
            log.error("메시지 전송 실패");
        }
    }
}