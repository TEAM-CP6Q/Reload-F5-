package com.f5.accountserver.Repository;

import com.f5.accountserver.Entity.DesignerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DesignerRepository extends JpaRepository<DesignerEntity, Long> {
}
