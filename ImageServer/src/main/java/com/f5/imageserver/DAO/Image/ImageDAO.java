package com.f5.imageserver.DAO.Image;

import com.f5.imageserver.Entity.Image.ImageEntity;

import java.util.Optional;

public interface ImageDAO {
    ImageEntity uploadImage(ImageEntity imageEntity);
    Optional<ImageEntity> downloadImage(Long id);
}
