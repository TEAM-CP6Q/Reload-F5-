package com.f5.authserver.Service.User;

import com.f5.authserver.Entity.AdministratorEntity;
import com.f5.authserver.Entity.UserEntity;
import com.f5.authserver.Repository.AdministratorRepository;
import com.f5.authserver.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CustomUserKakaoDetailsService implements UserDetailsService {
    private final UserRepository userRepository;
    private final AdministratorRepository administratorRepository;

    // email 을 이용하여 해당 객체를 Spring Security 의 UserDetails 객체로 변환
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 먼저 사용자 찾기
        UserEntity user = userRepository.findByEmail(email).orElse(null);

        if (user != null) {
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getUserId(),
                    new ArrayList<>()
            );
        } else throw new UsernameNotFoundException(email);
    }
}
