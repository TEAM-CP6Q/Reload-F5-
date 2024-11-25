package com.f5.authserver;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test") // 'application-test.properties' 사용
@SpringBootTest
public class AuthServerApplicationTests {

    @Test
    void contextLoads() {
        // 테스트 실행
    }
}

