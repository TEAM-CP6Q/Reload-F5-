package com.f5.chatserver.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class MessageDTO {
    private Long chatId;
    private String content;
    private String sender;
}