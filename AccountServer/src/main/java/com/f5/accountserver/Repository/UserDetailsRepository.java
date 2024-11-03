package com.f5.accountserver.Repository;

import com.f5.accountserver.Entity.UserDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailsRepository extends JpaRepository<UserDetailsEntity, Long> {
    //UserDetailsEntity findByNickname(String nickname);
    Optional<UserDetailsEntity> findById(Long id);
}
