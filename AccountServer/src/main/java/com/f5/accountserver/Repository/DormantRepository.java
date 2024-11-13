package com.f5.accountserver.Repository;

import com.f5.accountserver.Entity.DormantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface DormantRepository extends JpaRepository<DormantEntity, Long> {
    List<DormantEntity> findAll();
    List<DormantEntity> findByDormantDateBefore(LocalDate date);
}