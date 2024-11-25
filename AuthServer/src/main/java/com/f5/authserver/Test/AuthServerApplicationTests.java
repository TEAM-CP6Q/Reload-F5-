package com.f5.authserver.Test;

import com.f5.authserver.TestApplication;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest(classes = TestApplication.class)
@ActiveProfiles("test")
public class AuthServerApplicationTests {
    @Test
    void contextLoads() {
        // 테스트 코드
    }
}

