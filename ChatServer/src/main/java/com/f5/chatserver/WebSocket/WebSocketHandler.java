//package com.f5.chatserver.WebSocket;
//
//import com.f5.chatserver.DTO.ChatDTO;
//import com.f5.chatserver.DTO.MessageDTO;
//import com.f5.chatserver.Service.ChatService;
//import com.f5.chatserver.Service.MessageService;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import jakarta.transaction.Transactional;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//import org.springframework.web.socket.TextMessage;
//import org.springframework.web.socket.WebSocketSession;
//import org.springframework.web.socket.handler.TextWebSocketHandler;
//
//@Slf4j
//@RequiredArgsConstructor
//@Component
//@Transactional
//public class WebSocketHandler extends TextWebSocketHandler {
//
//    private final ObjectMapper objectMapper;
//    //payload를 Message 객체로 만들어 주기 위한 objectMapper
//
//    private final ChatService chatService;
//    private final MessageService messageService;
//
//    @Override
//    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
//        String payload = message.getPayload(); //메세지를 가져오기
//        log.info("{}", payload); //log 출력
//
//        MessageDTO messageDTO = objectMapper.readValue(payload, MessageDTO.class);
//        //payload를 ChatMessage 객체로 만들어주기
//        messageService.saveMessage(messageDTO);
//
//        ChatDTO chatDTO = chatService.findChatId(messageDTO.getChatId());
//        //ChatMessage 객체에서 roomId를 가져와 일치하는 room 주입
//
//        chatDTO.handlerActions(session, messageDTO, chatService);
//    }
//}