package com.f5.pickupmanagementserver.Repository;

import com.f5.pickupmanagementserver.Entity.LocationEntity;
import com.f5.pickupmanagementserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<LocationEntity, Long> {
    Boolean existsByPickupList(PickupListEntity pickupList);
    LocationEntity findByPickupList(PickupListEntity pickupList);
}
