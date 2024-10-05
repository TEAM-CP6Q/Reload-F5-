package com.f5.authserver.DAO.Administrator;

import com.f5.authserver.DTO.AdministratorDTO;
import com.f5.authserver.Entity.AdministratorEntity;

import java.util.Optional;

public interface AdministratorDAO {
    Optional<AdministratorEntity> findByAdminCode(String adminCode);
    Boolean existsByAdminCode(String adminCode);
    AdministratorDTO addAdministrator(AdministratorDTO administratorDTO);
}
