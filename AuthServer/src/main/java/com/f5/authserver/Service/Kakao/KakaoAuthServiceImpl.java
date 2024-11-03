package com.f5.authserver.Service.Kakao;

import com.f5.authserver.DAO.User.UserDAO;
import com.f5.authserver.DTO.UserKakaoDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.client.HttpClientErrorException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashMap;

@Service
public class KakaoAuthServiceImpl implements KakaoAuthService {

    private final UserDAO userDAO;

    @Value("${kakao.client-id}") // application.properties에서 클라이언트 ID 가져오기
    private String clientId;

    @Value("${kakao.redirect-uri}") // 리다이렉트 URI
    private String redirectUri;

    //private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public KakaoAuthServiceImpl(UserDAO userDAO, ObjectMapper objectMapper) {
        this.userDAO = userDAO;
        //this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public String getAccessToken(String authCode) {
        RestTemplate rt = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", clientId);
        params.add("redirect_uri", redirectUri);
        params.add("code", authCode);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<LinkedHashMap> accessTokenResponse = rt.exchange(
                    "https://kauth.kakao.com/oauth/token",
                    HttpMethod.POST,
                    kakaoTokenRequest,
                    LinkedHashMap.class
            );

            String accessToken = accessTokenResponse.getBody().get("access_token").toString();
            LinkedHashMap<String, Object> value = fetchKakaoUserData(accessToken);
            String email = (String) value.get("email");
            Long id = (Long) value.get("id");
            String phoneNumber = (String) value.get("phone_number");
            String name = value.get("name").toString();

            System.out.printf("email: " + email + ", id: " +
                    id + ", phoneNumber: " + phoneNumber +
                    ", name: " + name + "\n");

            if(!userDAO.existsByEmail(email))
                return "회원가입 필요";
            else{
                UserKakaoDTO userKakaoDTO = userDAO.getKakaoByEmail(email);
                if(userKakaoDTO.getKakao())
                    return userKakaoDTO.getEmail();
            }

            return "Bearer "+accessTokenResponse.getBody().get("access_token");

        } catch (HttpClientErrorException e) {
            System.err.println("카카오 API 요청 실패: " + e.getResponseBodyAsString());
            throw new RuntimeException("카카오 API 요청 실패", e);
        } catch (Exception e) {
            throw new RuntimeException("JSON 파싱 오류", e);
        }
    }

    private LinkedHashMap<String, Object> fetchKakaoUserData(String kakaoAccessToken) throws URISyntaxException {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
        headers.set("Authorization", "Bearer " + kakaoAccessToken);
        HttpEntity<?> http = new HttpEntity<>(headers);
        URI uri = new URI("https://kapi.kakao.com/v2/user/me");

        ResponseEntity<LinkedHashMap> response = restTemplate.exchange(uri, HttpMethod.GET, http, LinkedHashMap.class);
        Long id = (Long) response.getBody().get("id");
        LinkedHashMap<String, Object> value = (LinkedHashMap<String, Object>) response.getBody().get("kakao_account");
        value.put("id", id);
        return value;
    }

}
