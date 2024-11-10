package com.f5.accountserver.Service.UserDetails;

import com.f5.accountserver.DTO.UserDetailDTO;

import java.util.List;

public interface UserDetailsService {
    void saveUserDetails(UserDetailDTO userDetails);
    UserDetailDTO getUserDetails(Long id);
    void updateUserDetails(UserDetailDTO userDetails);
    void deleteAccount(Long id);
    List<UserDetailDTO> findAllUserDetails();
}
