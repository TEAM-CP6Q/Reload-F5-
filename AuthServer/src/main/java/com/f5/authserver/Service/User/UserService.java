package com.f5.authserver.Service.User;

import com.f5.authserver.DTO.RegisterDTO;
import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.Entity.UserEntity;

public interface UserService {
    UserDTO registerUser(RegisterDTO registerDTO);
    Long getIdByEmail(String email);
    UserEntity getLoggedInUserEntity(String email);
    void dormantAccount(UserDTO user);
    UserDTO getByEmail(String email);
}
