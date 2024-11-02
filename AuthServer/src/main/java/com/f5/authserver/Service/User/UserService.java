package com.f5.authserver.Service.User;

import com.f5.authserver.DTO.RegisterDTO;
import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.Entity.UserEntity;

public interface UserService {
    UserDTO registerUser(RegisterDTO registerDTO);
    UserDTO getByUsername(String username);
    UserEntity getLoggedInUserEntity(String username);
    void dormantAccount(UserDTO user);
    Long getIdByUsername(String username);
}
