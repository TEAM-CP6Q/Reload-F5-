package com.f5.authserver.Service.Communication;

import com.f5.authserver.DTO.User.UserDetailDTO;

public interface AccountCommunicationService {
    void registerAccount(UserDetailDTO userDetailDTO);
    void deleteAccount(Long id);
    String getAccountEmail(Long id);
    void releaseAccount(Long id);
}
