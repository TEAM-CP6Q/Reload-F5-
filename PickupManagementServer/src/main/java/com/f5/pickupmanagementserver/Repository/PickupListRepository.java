package com.f5.pickupmanagementserver.Repository;

import com.f5.pickupmanagementserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickupListRepository extends JpaRepository<PickupListEntity, Long> {
    Boolean existsByPickupId(Long pickupId);
    PickupListEntity findByPickupId(Long pickupId);
}
