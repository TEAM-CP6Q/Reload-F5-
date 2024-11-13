package com.f5.accountserver.DAO.UserDetails;

import com.f5.accountserver.DTO.UserDetailDTO;

import java.util.List;

public interface UserDetailsDAO {
    void save(UserDetailDTO userDetails);
    UserDetailDTO findById(Long id);
    void update(UserDetailDTO userDetails);
    void removeAccount(Long id);
    List<UserDetailDTO> findAllUserDetails();
}
