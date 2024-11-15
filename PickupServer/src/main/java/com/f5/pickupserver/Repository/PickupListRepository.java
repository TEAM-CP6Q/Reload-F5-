package com.f5.pickupserver.Repository;

import com.f5.pickupserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PickupListRepository extends JpaRepository<PickupListEntity, Long> {
    Boolean existsByPickupId(Long pickupId);
    PickupListEntity findByPickupId(Long pickupId);
}
