package com.f5.paymentserver.Config;

import com.siot.IamportRestClient.IamportClient;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentConfig {
    String apiKey = "8743303602662831";
    String secretKey = "zeNH64ZWepwqxIIkjGQvV1EBBggHUcAJ2e9aBaMIEis5A7XdFB23xobZDWMFSPe708XIgDdcvzDaxtxz";

    @Bean
    public IamportClient iamportClient() {
        return new IamportClient(apiKey, secretKey);
    }
}
