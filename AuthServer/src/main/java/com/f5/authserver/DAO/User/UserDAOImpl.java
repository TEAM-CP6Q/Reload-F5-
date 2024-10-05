package com.f5.authserver.DAO.User;

import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.Entity.UserEntity;
import com.f5.authserver.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserDAOImpl implements UserDAO {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDTO save(UserDTO user) {
        UserEntity userEntity = UserEntity.builder()
                .username(user.getUsername())
                .password(passwordEncoder.encode(user.getPassword()))
                .build();
        userRepository.save(userEntity);
        return user;
    }

    @Override
    public Boolean existsByUsername(String username) {
        return userRepository.existsByUsername(username);
    }

    @Override
    public UserDTO getByUsername(String username) {
        try {
            UserEntity user = userRepository.getByUsername(username);
            return UserDTO.builder()
                    .username(user.getUsername())
                    .password(user.getPassword())
                    .build();
        } catch (Exception e){
            throw new IllegalStateException("해당 사용자 이름을 찾을 수 없습니다.", e);
        }
    }

    @Override
    public Optional<UserEntity> findByUsername(String username) {
        return userRepository.findByUsername(username);  // Optional로 엔티티 반환
    }
}
