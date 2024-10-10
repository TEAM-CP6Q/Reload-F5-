package com.f5.accountserver.Repository;

import com.f5.accountserver.Entity.UserDetailsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserDetailsRepository extends JpaRepository<UserDetailsEntity, Long> {
    UserDetailsEntity findByEmail(String email);
    Optional<UserDetailsEntity> findById(Long id);
}
