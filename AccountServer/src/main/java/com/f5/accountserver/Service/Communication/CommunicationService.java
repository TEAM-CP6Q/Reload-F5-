package com.f5.accountserver.Service.Communication;

public interface CommunicationService {
    String getEmail(Long id);
    Long searchInfo(String username);
}
