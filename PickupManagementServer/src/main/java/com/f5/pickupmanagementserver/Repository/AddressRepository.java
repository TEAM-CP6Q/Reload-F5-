package com.f5.pickupmanagementserver.Repository;

import com.f5.pickupmanagementserver.Entity.AddressEntity;
import com.f5.pickupmanagementserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AddressRepository extends JpaRepository<AddressEntity, Long> {
    AddressEntity findByPickupList(PickupListEntity pickupList);
    Boolean existsByEmail(String email);
    List<AddressEntity> findByEmail(String email);
}
