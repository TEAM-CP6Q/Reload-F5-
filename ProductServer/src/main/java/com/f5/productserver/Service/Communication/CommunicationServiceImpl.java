package com.f5.productserver.Service.Communication;

import com.f5.productserver.Controller.Product.ProductController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class CommunicationServiceImpl implements CommunicationService{
    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);
    public CommunicationServiceImpl(DiscoveryClient discoveryClient, RestTemplate restTemplate) {
        this.discoveryClient = discoveryClient;
        this.restTemplate = restTemplate;
    }

    public String getDesignerById(Long id) {
        // ACCOUNT-SERVER에서 서비스 인스턴스를 가져옵니다.
        List<ServiceInstance> instances = discoveryClient.getInstances("ACCOUNT-SERVER");
        if (instances == null || instances.isEmpty()) {
            throw new IllegalStateException("No Account-Server instances available");
        }

        // 무작위 인스턴스 선택
        ServiceInstance accountService = instances.get(new Random().nextInt(instances.size()));

        // URI 빌드
        URI uri = UriComponentsBuilder.fromUri(accountService.getUri())
                .path("/api/account/designer/get-designer/{id}")
                .buildAndExpand(id)
                .toUri();

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);
        try {
            // GET 요청 실행
            ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.GET, httpEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                // 디자이너 이름 추출
                Object name = responseBody.get("name"); // JSON의 'name' 필드
                return name != null ? name.toString() : null;
            } else {
                throw new IllegalStateException("Failed to get designer information.");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send request to Account-Server", e);
        }
    }

    public Long getDesigner(Long id) {
        // ACCOUNT-SERVER에서 서비스 인스턴스를 가져옵니다.
        List<ServiceInstance> instances = discoveryClient.getInstances("ACCOUNT-SERVER");
        if (instances == null || instances.isEmpty()) {
            throw new IllegalStateException("No Account-Server instances available");
        }

        // 무작위 인스턴스 선택
        ServiceInstance accountService = instances.get(new Random().nextInt(instances.size()));

        // URI 빌드
        URI uri = UriComponentsBuilder.fromUri(accountService.getUri())
                .path("/api/account/designer/get-designer/{id}")
                .buildAndExpand(id)
                .toUri();

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);
        try {
            // GET 요청 실행
            ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.GET, httpEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();

                // 디자이너 인덱스 추출 (JSON의 'id' 필드 또는 'index' 필드로 가정)
                Object index = responseBody.get("id"); // 또는 responseBody.get("index");

                if (index != null) {
                    return Long.valueOf(index.toString()); // 인덱스를 Long으로 변환하여 반환
                } else {
                    throw new IllegalStateException("Designer index not found in response.");
                }
            } else {
                throw new IllegalStateException("Failed to get designer information.");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send request to Account-Server", e);
        }
    }

    public List<String> uploadImagesToImageServer(List<MultipartFile> images) {
        // 서비스 인스턴스 조회
        List<ServiceInstance> instances = discoveryClient.getInstances("IMAGE-SERVER");
        if (instances == null || instances.isEmpty()) {
            throw new IllegalStateException("No Image-Server instances available");
        }

        // 무작위 인스턴스 선택
        ServiceInstance imageServiceInstance = instances.get(new Random().nextInt(instances.size()));
        URI uri = UriComponentsBuilder.fromUri(imageServiceInstance.getUri())
                .path("/api/image/upload")
                .build()
                .toUri();

        // Multipart 요청 구성
        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        for (MultipartFile file : images) {
            try {
                ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
                    @Override
                    public String getFilename() {
                        return file.getOriginalFilename();
                    }
                };
                body.add("images", resource);
            } catch (IOException e) {
                throw new IllegalStateException("Failed to read image file: " + file.getOriginalFilename(), e);
            }
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        HttpEntity<MultiValueMap<String, Object>> httpEntity = new HttpEntity<>(body, headers);

        try {
            // POST 요청 실행
            ResponseEntity<Map> response = restTemplate.exchange(
                    uri,
                    HttpMethod.POST,
                    httpEntity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                logger.info("Response body from ImageServer: {}", responseBody);
                // imageUrls 처리
                Object imageUrlsObj = responseBody.get("images");
                if (imageUrlsObj instanceof List<?> imageUrlsList) {
                    // 각 요소를 String으로 변환
                    return imageUrlsList.stream()
                            .map(obj -> {
                                if (obj instanceof String) {
                                    return (String) obj;
                                } else {
                                    throw new IllegalStateException("Invalid image URL type: " + obj.getClass());
                                }
                            })
                            .collect(Collectors.toList());
                } else {
                    throw new IllegalStateException("No image URLs returned or invalid format.");
                }
            } else {
                throw new IllegalStateException("Failed to upload images. Status Code: " + response.getStatusCode());
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send request to Image-Server", e);
        }
    }


}
