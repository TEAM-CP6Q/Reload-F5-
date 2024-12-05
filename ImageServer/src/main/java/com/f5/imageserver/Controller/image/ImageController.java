package com.f5.imageserver.Controller.image;

import com.f5.imageserver.DTO.Image.ImageDTO;
import com.f5.imageserver.Service.Image.ImageService;
import com.netflix.discovery.converters.Auto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/image")
public class ImageController {
    private final ImageService imageService;

    @Autowired
    public ImageController(ImageService imageService) {
        this.imageService = imageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ImageDTO> uploadImage(@RequestPart List<MultipartFile> images) throws IOException {
        return this.imageService.uploadImage(images);
    }

    @GetMapping(value = "/download/{id}", produces = {MediaType.IMAGE_JPEG_VALUE, MediaType.IMAGE_PNG_VALUE})
    public  ResponseEntity<byte[]> downloadImage(
            @PathVariable("id") Long id
    ){
        return this.imageService.downloadImage(id);
    }

    @DeleteMapping("/delete-image/{imageId}")
    public ResponseEntity<?> deleteImage(@PathVariable("imageId") Long id) {
        try {
            imageService.deleteImage(id);
            return ResponseEntity.ok("이미지 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
