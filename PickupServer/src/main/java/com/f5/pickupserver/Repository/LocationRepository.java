package com.f5.pickupserver.Repository;

import com.f5.pickupserver.Entity.LocationEntity;
import com.f5.pickupserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<LocationEntity, Long> {
    Boolean existsByPickupList(PickupListEntity pickupList);
    LocationEntity findByPickupList(PickupListEntity pickupList);
    void deleteByPickupList(PickupListEntity pickupList);
}
