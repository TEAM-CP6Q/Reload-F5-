package com.f5.authserver.Service.User;

import com.f5.authserver.DAO.User.UserDAO;
import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.Entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserDAO userDAO;

    @Override
    public UserDTO registerUser(UserDTO userDTO) {
        if(userDAO.existsByUsername(userDTO.getUsername())) {
            throw new IllegalArgumentException("이미 존재하는 사용자 이름입니다.");
        }
        return userDAO.save(userDTO);
    }

    @Override
    public UserDTO getByUsername(String username) {
        return userDAO.getByUsername(username);
    }

    @Override
    public UserEntity getLoggedInUserEntity(String username) {
        return userDAO.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 이름을 찾을 수 없습니다."));
    }
}
