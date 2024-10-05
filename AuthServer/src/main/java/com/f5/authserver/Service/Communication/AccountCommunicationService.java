package com.f5.authserver.Service.Communication;

import com.f5.authserver.DTO.UserDetailDTO;

public interface AccountCommunicationService {
    void registerAccount(UserDetailDTO userDetailDTO);
}
