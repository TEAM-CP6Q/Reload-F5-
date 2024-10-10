package com.f5.accountserver.Service.UserDetails;

import com.f5.accountserver.DAO.UserDetails.UserDetailsDAO;
import com.f5.accountserver.DTO.UserDetailDTO;
import org.springframework.aop.scope.ScopedProxyUtils;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    private final UserDetailsDAO userDetailsDAO;

    public UserDetailsServiceImpl(UserDetailsDAO userDetailsDAO) {
        this.userDetailsDAO = userDetailsDAO;
    }

    @Override
    public void saveUserDetails(UserDetailDTO userDetails) {
        try {
            userDetailsDAO.save(userDetails);
        } catch (Exception e) {
            throw new IllegalStateException("상세 정보 저장 실패", e);
        }
    }

    @Override
    public UserDetailDTO getUserDetails(Long id) {
        return userDetailsDAO.findById(id);
    }

    @Override
    public void updateUserDetails(UserDetailDTO userDetails) {
        userDetailsDAO.update(userDetails);
    }

    @Override
    public void dormantAccount(Long id){
        try{
            userDetailsDAO.dormantAccount(id);
        } catch (Exception e){
            throw new IllegalStateException("삭제 실패", e);
        }
    }

    @Scheduled(cron = "0 0 0 * * ?")
    public void scheduledTaskToRemoveDormantAccount() {
        userDetailsDAO.removeDormantAccount();
    }
}
