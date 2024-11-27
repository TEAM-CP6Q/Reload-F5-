package com.f5.pickupserver.Repository;

import com.f5.pickupserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface PickupListRepository extends JpaRepository<PickupListEntity, Long> {
    Boolean existsByPickupId(Long pickupId);
    PickupListEntity findByPickupId(Long pickupId);
    @Query("SELECT p FROM PickupListEntity p WHERE DATE(p.pickupDate) = :pickupDate")
    List<PickupListEntity> findByPickupDateOnly(@Param("pickupDate") LocalDate pickupDate);
}
