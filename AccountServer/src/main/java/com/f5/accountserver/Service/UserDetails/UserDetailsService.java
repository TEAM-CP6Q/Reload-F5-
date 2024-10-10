package com.f5.accountserver.Service.UserDetails;

import com.f5.accountserver.DTO.UserDetailDTO;

public interface UserDetailsService {
    void saveUserDetails(UserDetailDTO userDetails);
    UserDetailDTO getUserDetails(Long id);
    void updateUserDetails(UserDetailDTO userDetails);
    void dormantAccount(Long id);
}
