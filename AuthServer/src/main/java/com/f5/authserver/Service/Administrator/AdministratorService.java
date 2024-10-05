package com.f5.authserver.Service.Administrator;

import com.f5.authserver.DTO.AdministratorDTO;
import com.f5.authserver.Entity.AdministratorEntity;

public interface AdministratorService {
    AdministratorEntity getLoggedInAdministratorEntity(String adminCode);
    AdministratorDTO addAdministrator(AdministratorDTO administratorDTO);
}
