package com.f5.accountserver.DAO.UserDetails;

import com.f5.accountserver.DTO.UserDetailDTO;

public interface UserDetailsDAO {
    void save(UserDetailDTO userDetails);
    UserDetailDTO findById(Long id);
    void update(UserDetailDTO userDetails);
    void dormantAccount(Long id);
    void removeDormantAccount();
}
