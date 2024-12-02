package com.f5.imageserver.Service.Image;

import com.f5.imageserver.DAO.Image.ImageDAO;
import com.f5.imageserver.DTO.Image.ImageDTO;
import com.f5.imageserver.Entity.Image.ImageEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ImageServiceImpl implements ImageService {
    private final ImageDAO imageDAO;

    public ImageServiceImpl(ImageDAO imageDAO) {
        this.imageDAO = imageDAO;
    }

    public ResponseEntity<ImageDTO> uploadImage(List<MultipartFile> images) throws IOException {
        List<String> imagesURI = new ArrayList<>();
        for(MultipartFile image : images){
            ImageEntity imageEntity =   this.imageDAO.uploadImage(ImageEntity.builder().image(image.getBytes()).build());
            imagesURI.add("http://3.37.122.192:8000/api/image/download/"+imageEntity.getId());
        }

        return ResponseEntity.status(201)
                .body(ImageDTO.builder()
                        .result("success")
                        .images(imagesURI).build());
    }

    // 이미지 경로로 조회
    public ResponseEntity<byte[]> downloadImage(Long id) {
        Optional<ImageEntity> image = this.imageDAO.downloadImage(id);
        if(!image.isPresent()) {
            return ResponseEntity.status(404).body(null);
        }
        return ResponseEntity.status(200)
                .body(image.get().getImage());
    }

}
