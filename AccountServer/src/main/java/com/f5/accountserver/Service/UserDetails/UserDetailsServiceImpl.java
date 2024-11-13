package com.f5.accountserver.Service.UserDetails;

import com.f5.accountserver.DAO.UserDetails.UserDetailsDAO;
import com.f5.accountserver.DTO.UserDetailDTO;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

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
            throw new IllegalStateException("상세 정보 저장 실패");
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
    public void deleteAccount(Long id){
        try{
            userDetailsDAO.removeAccount(id);
        } catch (Exception e){
            throw new IllegalStateException("삭제 실패");
        }
    }

    @Override
    public List<UserDetailDTO> findAllUserDetails() {
        return userDetailsDAO.findAllUserDetails();
    }
}
