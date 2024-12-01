package com.f5.productserver.Service.Communication;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CommunicationService {
    String getDesignerById(Long id);
    List<String> uploadImagesToImageServer(List<MultipartFile> images);
    Long getDesigner(Long id);
}
