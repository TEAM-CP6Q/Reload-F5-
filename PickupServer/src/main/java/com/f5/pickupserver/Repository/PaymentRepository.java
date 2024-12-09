package com.f5.pickupserver.Repository;

import com.f5.pickupserver.Entity.PaymentEntity;
import com.f5.pickupserver.Entity.PickupListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<PaymentEntity, Long> {
    Boolean existsByMerchantUid(String merchantUid);
    Boolean existsByPickupListEntity(PickupListEntity pickupListEntity);
}
