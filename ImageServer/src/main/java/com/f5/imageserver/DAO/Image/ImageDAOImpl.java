package com.f5.imageserver.DAO.Image;

import com.f5.imageserver.Entity.Image.ImageEntity;
import com.f5.imageserver.Repository.Image.ImageRepository;
import com.netflix.discovery.converters.Auto;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class ImageDAOImpl implements ImageDAO{
    private final ImageRepository imageRepository;

    @Autowired
    public ImageDAOImpl(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @Override
    public ImageEntity uploadImage(ImageEntity imageEntity) {
        return this.imageRepository.save(imageEntity);
    }

    @Override
    public Optional<ImageEntity> downloadImage(Long id) {
        return this.imageRepository.findById(id);
    }
}
