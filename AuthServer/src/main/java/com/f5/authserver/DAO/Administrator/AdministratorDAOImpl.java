package com.f5.authserver.DAO.Administrator;

import com.f5.authserver.DTO.AdministratorDTO;
import com.f5.authserver.Entity.AdministratorEntity;
import com.f5.authserver.Repository.AdministratorRepository;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdministratorDAOImpl implements AdministratorDAO {
    private final AdministratorRepository administratorRepository;

    public AdministratorDAOImpl(AdministratorRepository administratorRepository) {
        this.administratorRepository = administratorRepository;
    }

    @Override
    public Optional<AdministratorEntity> findByAdminCode(String adminCode) {
        return administratorRepository.findByAdminCode(adminCode);  // Optional로 엔티티 반환
    }

    @Override
    public Boolean existsByAdminCode(String adminCode) {
        return administratorRepository.existsByAdminCode(adminCode);
    }

    @Override
    public AdministratorDTO addAdministrator(AdministratorDTO administratorDTO) {
        AdministratorEntity administratorEntity = new AdministratorEntity();
        administratorEntity.setAdminCode(administratorDTO.getAdminCode());
        administratorRepository.save(administratorEntity);
        return administratorDTO;
    }
}
