package com.f5.pickupserver.Repository;

import com.f5.pickupserver.Entity.DetailsEntity;
import com.f5.pickupserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DetailsRepository extends JpaRepository<DetailsEntity, Long> {
    List<DetailsEntity> findAllByPickupList(PickupListEntity pickupList);
}
