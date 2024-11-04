package com.f5.authserver.DAO.User;

import com.f5.authserver.DTO.*;
import com.f5.authserver.Entity.DormantEntity;
import com.f5.authserver.Entity.UserEntity;
import com.f5.authserver.Repository.DormantRepository;
import com.f5.authserver.Repository.UserRepository;
import com.f5.authserver.Service.Communication.AccountCommunicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class UserDAOImpl implements UserDAO {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountCommunicationService accountCommunicationService;
    private final DormantRepository dormantRepository;

    private UserDTO entityToDTO(UserEntity userEntity) {
        return UserDTO.builder()
                .email(userEntity.getEmail())
                .password(passwordEncoder.encode(userEntity.getPassword()))
                .build();
    }

    @Override
    public UserDTO save(RegisterDTO registerDTO) {
        try {
            UserEntity userEntity = UserEntity.builder()
                    .email(registerDTO.getEmail())
                    .password(passwordEncoder.encode(registerDTO.getPassword()))
                    .kakao(false)
                    .build();
            userRepository.save(userEntity);
            UserDetailDTO userDetailDTO = UserDetailDTO.builder()
                    .id(userEntity.getId())
                    .name(registerDTO.getName())
                    .postalCode(registerDTO.getPostalCode())
                    .roadNameAddress(registerDTO.getRoadNameAddress())
                    .detailedAddress(registerDTO.getDetailedAddress())
                    .phoneNumber(registerDTO.getPhoneNumber())
                    .build();
            accountCommunicationService.registerAccount(userDetailDTO);
            return entityToDTO(userEntity);
        } catch (Exception e) {
            throw new IllegalStateException("잘못된 형식의 요청.", e);
        }
    }

    @Override
    public Boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email) || dormantRepository.existsByEmail(email);
    }

    @Override
    public UserDTO getByEmail(String email) {
        try {
            UserEntity user = userRepository.getByEmail(email);
            return UserDTO.builder()
                    .email(user.getEmail())
                    .password(user.getPassword())
                    .build();
        } catch (Exception e){
            throw new IllegalStateException("해당 사용자 이름을 찾을 수 없습니다.", e);
        }
    }

    @Override
    public UserKakaoDTO getKakaoByEmail(String email) {
        try{
            UserEntity user = userRepository.getByEmail(email);
            return UserKakaoDTO.builder()
                    .email(user.getEmail())
                    .password(user.getPassword())
                    .kakao(user.getKakao())
                    .build();
        } catch (Exception e){
            throw new IllegalStateException("해당 사용자를 찾을 수 없습니다.");
        }
    }

    @Override
    public Optional<UserEntity> findByEmail(String email) {
        return userRepository.findByEmail(email);  // Optional로 엔티티 반환
    }


    @Override
    public void moveToDormantAccount(UserDTO userDTO) {
        try {
            if (userRepository.existsByEmail(userDTO.getEmail())) {
                UserEntity user = userRepository.getByEmail(userDTO.getEmail());
                DormantEntity dormant = DormantEntity.builder()
                        .Id(user.getId())
                        .email(user.getEmail())
                        .password(user.getPassword())
                        .kakao(user.getKakao())
                        .dormantDate(LocalDate.now())
                        .build();
                dormantRepository.save(dormant);
                accountCommunicationService.dormantAccount(dormant.getId()); // 중첩 예외 제거
                userRepository.delete(user); // 실제 삭제 로직 확인 필요
            } else {
                throw new IllegalArgumentException("해당 이메일이 없음");
            }
        } catch (Exception e) {
            throw new IllegalStateException("삭제에 실패 하였습니다.", e);
        }
    }

    @Override
    public void removeDormantAccount() {
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        List<DormantEntity> expiredDormantAccounts = dormantRepository.findByDormantDateBefore(threeMonthsAgo);

        for (DormantEntity dormant : expiredDormantAccounts) {
            System.out.println(LocalDate.now()+ " " + dormant.getEmail() + " 계정이 삭제됨");
            dormantRepository.delete(dormant);
        }
    }

    @Override
    public Long getId(String email){
        return userRepository.getByEmail(email).getId();
    }

    @Override
    public void integrationInfo(IntegrationDTO integrationDTO) {
        try {
            UserEntity userEntity = userRepository.getByEmail(integrationDTO.getEmail());
            userEntity.setEmail(integrationDTO.getEmail());
            userEntity.setPassword(passwordEncoder.encode(integrationDTO.getUserId()));
            userEntity.setKakao(true);
            userRepository.save(userEntity);
        } catch (Exception e) {
            throw new IllegalStateException("통합에 실패 하였습니다.");
        }
    }
}
