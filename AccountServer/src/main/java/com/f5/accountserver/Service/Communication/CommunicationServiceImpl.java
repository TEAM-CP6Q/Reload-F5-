package com.f5.accountserver.Service.Communication;

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
public class CommunicationServiceImpl implements CommunicationService {
    private final DiscoveryClient discoveryClient;
    private final RestTemplate restTemplate;

    public CommunicationServiceImpl(DiscoveryClient discoveryClient, RestTemplate restTemplate) {
        this.discoveryClient = discoveryClient;
        this.restTemplate = restTemplate;
    }

    @Override
    public String getEmail(Long id) {
        List<ServiceInstance> instances = discoveryClient.getInstances("AUTH-SERVER");
        if (instances == null || instances.isEmpty()) {
            throw new IllegalStateException("No Auth-Server instances available");
        }

        // 랜덤하게 하나의 인스턴스를 선택
        ServiceInstance accountService = instances.get(new Random().nextInt(instances.size()));

        // URI 생성
        URI uri = UriComponentsBuilder.fromUri(accountService.getUri())
                .path("/api/auth/email/{id}")
                .buildAndExpand(id)
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);

        try {
            // 응답을 Map<String, Object>로 명확히 받기
            ResponseEntity<String> response = restTemplate.exchange(uri, HttpMethod.GET, httpEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return response.getBody();
            } else {
                throw new IllegalStateException("Failed to get email information.");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send request to Auth-Server", e);
        }
    }


    @Override
    public Long searchInfo(String email) {
        List<ServiceInstance> instances = discoveryClient.getInstances("AUTH-SERVER");
        if (instances == null || instances.isEmpty()) {
            throw new IllegalStateException("No Auth-Server instances available");
        }

        // Auth-Server 인스턴스 중 하나를 무작위로 선택
        ServiceInstance accountService = instances.get(new Random().nextInt(instances.size()));

        // URI 생성
        URI uri = UriComponentsBuilder.fromUri(accountService.getUri())
                .path("/api/auth/user-info/{email}")
                .buildAndExpand(email)
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);

        try {
            // 응답을 Map<String, Object>로 받도록 제네릭 타입을 명확히 지정
            ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.GET, httpEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                // 'id' 값을 Long으로 변환
                Number id = (Number) responseBody.get("id");
                return id != null ? id.longValue() : null;
            } else {
                throw new IllegalStateException("Failed to get user information.");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send request to Auth-Server", e);
        }
    }


}
