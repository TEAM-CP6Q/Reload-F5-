package com.f5.accountserver.DAO.UserDetails;

import com.f5.accountserver.DTO.UserDetailDTO;
import com.f5.accountserver.Entity.DormantEntity;
import com.f5.accountserver.Entity.UserDetailsEntity;
import com.f5.accountserver.Repository.DormantRepository;
import com.f5.accountserver.Repository.UserDetailsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;

@Component
@RequiredArgsConstructor
public class UserDetailsDAOImpl implements UserDetailsDAO {
    private final UserDetailsRepository userDetailsRepository;
    private final DormantRepository dormantRepository;

    @Override
    public void save(UserDetailDTO userDetails) {
        try{
            UserDetailsEntity userDetailsEntity = UserDetailsEntity.builder()
                    .Id(userDetails.getId())
                    .name(userDetails.getName())
                    .postalCode(userDetails.getPostalCode())
                    .roadNameAddress(userDetails.getRoadNameAddress())
                    .detailedAddress(userDetails.getDetailedAddress())
                    .phoneNumber(userDetails.getPhoneNumber())
                    .build();
            userDetailsRepository.save(userDetailsEntity);
        } catch (Exception e) {
            throw new IllegalStateException("상세 정보 저장 실패", e);
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
            throw new IllegalStateException("유저 상세 정보 업데이트 실패", e);
        }
    }

    @Override
    public void dormantAccount(Long id) {
        UserDetailsEntity user = userDetailsRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("해당 id의 유저가 없음: " + id));
        DormantEntity dormant = DormantEntity.builder()
                .Id(user.getId())
                .name(user.getName())
                .postalCode(user.getPostalCode())
                .roadNameAddress(user.getRoadNameAddress())
                .detailedAddress(user.getDetailedAddress())
                .phoneNumber(user.getPhoneNumber())
                .dormantDate(LocalDate.now())
                .build();
        dormantRepository.save(dormant);
        userDetailsRepository.delete(user); // 삭제 작업에서 예외가 발생할 경우, 트랜잭션이 롤백됨
    }

    @Override
    public void removeDormantAccount() {
        LocalDate threeMonthsAgo = LocalDate.now().minusMonths(3);
        List<DormantEntity> expiredDormantAccounts = dormantRepository.findByDormantDateBefore(threeMonthsAgo);
        for (DormantEntity dormant : expiredDormantAccounts) {
            System.out.println(LocalDate.now()+ " " + dormant.getName() + " 계정 정보가 삭제됨");
            dormantRepository.delete(dormant);
        }
    }
}
