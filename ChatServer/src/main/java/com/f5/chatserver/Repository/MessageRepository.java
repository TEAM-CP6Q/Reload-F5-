package com.f5.chatserver.Repository;

import com.f5.chatserver.Entity.ChatEntity;
import com.f5.chatserver.Entity.MessageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<MessageEntity, Long> {
    List<MessageEntity> findAllByChatEntity(ChatEntity chatEntity);
}
