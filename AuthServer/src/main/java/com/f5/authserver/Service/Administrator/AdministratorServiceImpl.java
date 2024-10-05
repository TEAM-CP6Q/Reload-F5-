package com.f5.authserver.Service.Administrator;

import com.f5.authserver.DAO.Administrator.AdministratorDAO;
import com.f5.authserver.DTO.AdministratorDTO;
import com.f5.authserver.Entity.AdministratorEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdministratorServiceImpl implements AdministratorService {
    private final AdministratorDAO administratorDAO;

    @Override
    public AdministratorEntity getLoggedInAdministratorEntity(String adminCode) {
        return administratorDAO.findByAdminCode(adminCode)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자 이름을 찾을 수 없습니다."));
    }

    @Override
    public AdministratorDTO addAdministrator(AdministratorDTO administratorDTO) {
        if(administratorDAO.existsByAdminCode(administratorDTO.getAdminCode())) {
            throw new IllegalArgumentException("중복된 어드민 코드");
        }
        return administratorDAO.addAdministrator(administratorDTO);
    }
}
