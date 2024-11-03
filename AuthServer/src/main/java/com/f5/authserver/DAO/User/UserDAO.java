package com.f5.authserver.DAO.User;

import com.f5.authserver.DTO.RegisterDTO;
import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.DTO.UserKakaoDTO;
import com.f5.authserver.Entity.UserEntity;

import java.util.Optional;

public interface UserDAO {
    UserDTO save(RegisterDTO registerDTO);
    Boolean existsByEmail(String email);
    UserDTO getByEmail(String email);
    Optional<UserEntity> findByEmail(String email);
    void moveToDormantAccount(UserDTO userDTO);
    void removeDormantAccount();
    Long getId(String username);
    UserKakaoDTO getKakaoByEmail(String email);
}
