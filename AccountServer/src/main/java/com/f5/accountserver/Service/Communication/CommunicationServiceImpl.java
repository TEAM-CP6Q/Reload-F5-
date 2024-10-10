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

    public Long searchInfo(String username) {
        List<ServiceInstance> instances = discoveryClient.getInstances("AUTH-SERVER");
        if (instances == null || instances.isEmpty()) {
            throw new IllegalStateException("No Auth-Server instances available");
        }

        ServiceInstance accountService = instances.get(new Random().nextInt(instances.size()));

        URI uri = UriComponentsBuilder.fromUri(accountService.getUri())
                .path("/api/auth/user-info/{username}")
                .buildAndExpand(username)
                .toUri();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<String> httpEntity = new HttpEntity<>(headers);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(uri, HttpMethod.GET, httpEntity, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> responseBody = response.getBody();
                // 'id' 값을 Integer로 받고 Long으로 변환
                Integer id = (Integer) responseBody.get("id");
                return id != null ? id.longValue() : null;
            } else {
                throw new IllegalStateException("Failed to get user information.");
            }
        } catch (Exception e) {
            throw new IllegalStateException("Failed to send request to Auth-Server", e);
        }
    }

}
