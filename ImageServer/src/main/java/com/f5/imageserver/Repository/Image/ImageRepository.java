package com.f5.imageserver.Repository.Image;

import com.f5.imageserver.Entity.Image.ImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImageRepository extends JpaRepository<ImageEntity, Long> {
    ImageEntity findAllById(Long id);
    boolean existsById(Long id);
}
