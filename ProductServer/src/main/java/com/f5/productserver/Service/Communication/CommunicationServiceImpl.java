package com.f5.productserver.Service.Communication;

import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;
import java.util.Map;
import java.util.Random;

@Service
public class CommunicationServiceImpl implements CommunicationService{
    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate;

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
}
