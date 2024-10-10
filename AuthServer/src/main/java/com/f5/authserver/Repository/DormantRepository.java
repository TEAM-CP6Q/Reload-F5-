package com.f5.authserver.Repository;

import com.f5.authserver.Entity.DormantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DormantRepository extends JpaRepository<DormantEntity, Long> {
    Boolean existsByUsername(String username);
    List<DormantEntity> findAll();
    List<DormantEntity> findByDormantDateBefore(LocalDate date);
}
