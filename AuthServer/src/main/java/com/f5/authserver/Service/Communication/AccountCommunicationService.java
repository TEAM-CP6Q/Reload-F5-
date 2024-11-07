package com.f5.authserver.Service.Communication;

import com.f5.authserver.DTO.User.UserDetailDTO;

public interface AccountCommunicationService {
    void registerAccount(UserDetailDTO userDetailDTO);
    void dormantAccount(Long id);
    String getAccountEmail(Long id);
}
