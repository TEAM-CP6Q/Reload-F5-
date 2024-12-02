package com.f5.imageserver.Service.Image;

import com.f5.imageserver.DTO.Image.ImageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ImageService {
    ResponseEntity<ImageDTO> uploadImage(List<MultipartFile> images) throws IOException;
    ResponseEntity<byte[]> downloadImage(Long id);
}
