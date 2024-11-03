package com.f5.authserver.Repository;

import com.f5.authserver.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Boolean existsByEmail(String username);
    Optional<UserEntity> findByEmail(String email);
    UserEntity getByEmail(String email);
}
