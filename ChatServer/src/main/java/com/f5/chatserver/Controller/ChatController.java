package com.f5.chatserver.Controller;

import com.f5.chatserver.DTO.StatusCodeDTO;
import com.f5.chatserver.Service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {
    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllChat(){
        try{
            return ResponseEntity.ok(chatService.findAllRoom());
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/create-chat")
    public ResponseEntity<?> createChat(@RequestParam("email") String email, @RequestParam("sender") String sender){
        try{
            return ResponseEntity.ok(chatService.createRoom(email, sender));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/user-chats")
    public ResponseEntity<?> getUserChat(@RequestParam("email") String email){
        try{
            return ResponseEntity.ok(chatService.findUserChatAll(email));
        } catch (Exception e){
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }
}
