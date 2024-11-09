package com.f5.pickupmanagementserver.Repository;

import com.f5.pickupmanagementserver.Entity.DetailsEntity;
import com.f5.pickupmanagementserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetailsRepository extends JpaRepository<DetailsEntity, Long> {
    List<DetailsEntity> findAllByPickupList(PickupListEntity pickupList);
}
