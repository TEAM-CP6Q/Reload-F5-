package com.f5.authserver.Service.User;

import com.f5.authserver.DAO.User.UserDAO;
import com.f5.authserver.DTO.RegisterDTO;
import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.Entity.UserEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserDAO userDAO;

    @Override
    public UserDTO registerUser(RegisterDTO registerDTO) {
        if(userDAO.existsByEmail(registerDTO.getEmail())) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }
        return userDAO.save(registerDTO);
    }

    @Override
    public UserDTO getByEmail(String email) {
        return userDAO.getByEmail(email);
    }

    @Override
    public Long getIdByEmail(String email) {
        return userDAO.getId(email);
    }

    @Override
    public UserEntity getLoggedInUserEntity(String email) {
        return userDAO.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("해당 이메일을 찾을 수 없습니다."));
    }

    @Override
    public void dormantAccount(UserDTO user) {
        try{
            userDAO.moveToDormantAccount(user);
        } catch (Exception e){
            throw new IllegalArgumentException(e);
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduledTaskToRemoveDormantAccount() {
        userDAO.removeDormantAccount();
    }
}
