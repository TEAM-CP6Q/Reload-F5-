package com.f5.authserver.DAO.User;

import com.f5.authserver.DTO.RegisterDTO;
import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.Entity.UserEntity;

import java.util.Optional;

public interface UserDAO {
    UserDTO save(RegisterDTO registerDTO);
    Boolean existsByUsername(String username);
    UserDTO getByUsername(String username);
    Optional<UserEntity> findByUsername(String username);
    void moveToDormantAccount(UserDTO userDTO);
    void removeDormantAccount();
}
