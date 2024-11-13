package com.f5.accountserver.DAO.UserDetails;

import com.f5.accountserver.DTO.UserDetailDTO;
import com.f5.accountserver.Entity.DormantEntity;
import com.f5.accountserver.Entity.UserDetailsEntity;
import com.f5.accountserver.Repository.DormantRepository;
import com.f5.accountserver.Repository.UserDetailsRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Component
@RequiredArgsConstructor
@Transactional
public class UserDetailsDAOImpl implements UserDetailsDAO {
    private final UserDetailsRepository userDetailsRepository;
    private final DormantRepository dormantRepository;

    @Override
    public void save(UserDetailDTO userDetails) {
        try{
            UserDetailsEntity userDetailsEntity = UserDetailsEntity.builder()
                    .id(userDetails.getId())
                    .name(userDetails.getName())
                    .postalCode(userDetails.getPostalCode())
                    .roadNameAddress(userDetails.getRoadNameAddress())
                    .detailedAddress(userDetails.getDetailedAddress())
                    .phoneNumber(userDetails.getPhoneNumber())
                    .build();
            userDetailsRepository.save(userDetailsEntity);
        } catch (Exception e) {
            throw new IllegalStateException("상세 정보 저장 실패");
        }
    }

    @Override
    public UserDetailDTO findById(Long id) {
        UserDetailsEntity user = userDetailsRepository.findById(id).orElseThrow(NoSuchElementException::new);
        return UserDetailDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .postalCode(user.getPostalCode())
                .roadNameAddress(user.getRoadNameAddress())
                .detailedAddress(user.getDetailedAddress())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }

    @Override
    public void update(UserDetailDTO userDetails) {
        try {
            UserDetailsEntity existingUser = userDetailsRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new IllegalArgumentException("해당 ID의 유저를 찾을 수 없습니다."));
            existingUser.setName(userDetails.getName());
            existingUser.setPostalCode(userDetails.getPostalCode());
            existingUser.setRoadNameAddress(userDetails.getRoadNameAddress());
            existingUser.setDetailedAddress(userDetails.getDetailedAddress());
            existingUser.setPhoneNumber(userDetails.getPhoneNumber());

            userDetailsRepository.save(existingUser);
        } catch (Exception e) {
            throw new IllegalStateException("유저 상세 정보 업데이트 실패");
        }
    }

    @Override
    public void removeAccount(Long id) {
        UserDetailsEntity user = userDetailsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 id의 유저가 없음: " + id));
        try {
            userDetailsRepository.delete(user); // 삭제 작업에서 예외가 발생할 경우, 트랜잭션이 롤백됨
        } catch (Exception e) {
            throw new IllegalStateException("유저 탈퇴 실패");
        }
    }

    @Override
    public List<UserDetailDTO> findAllUserDetails() {
        List<UserDetailDTO> userDetailDTOS = new ArrayList<>();
        userDetailsRepository.findAll().forEach(userDetails -> {
            UserDetailDTO userDetailDTO = new UserDetailDTO();
            userDetailDTO.setId(userDetails.getId());
            userDetailDTO.setName(userDetails.getName());
            userDetailDTO.setPostalCode(userDetails.getPostalCode());
            userDetailDTO.setRoadNameAddress(userDetails.getRoadNameAddress());
            userDetailDTO.setDetailedAddress(userDetails.getDetailedAddress());
            userDetailDTO.setPhoneNumber(userDetails.getPhoneNumber());
            userDetailDTOS.add(userDetailDTO);
        });
        return userDetailDTOS;
    }
}
