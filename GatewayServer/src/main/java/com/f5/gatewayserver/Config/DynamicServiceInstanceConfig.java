//package com.f5.gatewayserver.Config;
//
//import org.springframework.cloud.client.DefaultServiceInstance;
//import org.springframework.cloud.client.ServiceInstance;
//import org.springframework.cloud.client.loadbalancer.ServiceInstanceListSupplier;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.HttpStatus;
//import org.springframework.web.reactive.function.client.WebClient;
//import reactor.core.publisher.Flux;
//
//import java.time.Duration;
//import java.util.ArrayList;
//import java.util.Arrays;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Configuration
//public class DynamicServiceInstanceConfig {
//
//    @Bean
//    public ServiceInstanceListSupplier dynamicServiceInstanceListSupplier(WebClient.Builder webClientBuilder) {
//        return new DynamicServiceInstanceListSupplier(webClientBuilder);
//    }
//
//    static class DynamicServiceInstanceListSupplier implements ServiceInstanceListSupplier {
//
//        private final WebClient webClient;
//        private final List<ServiceInstance> instances;
//
//        public DynamicServiceInstanceListSupplier(WebClient.Builder webClientBuilder) {
//            this.webClient = webClientBuilder.build();
//            // Static list of service instances
//            this.instances = Arrays.asList(
//                    new DefaultServiceInstance("auth-server-1", "AUTH-SERVER", "3.37.122.192", 10000, false),
//                    new DefaultServiceInstance("auth-server-2", "AUTH-SERVER", "3.37.122.192", 10001, false)
//            );
//        }
//
//        @Override
//        public String getServiceId() {
//            return "AUTH-SERVER";
//        }
//
//        @Override
//        public Flux<List<ServiceInstance>> get() {
//            return Flux.interval(Duration.ofSeconds(5)) // Health check every 5 seconds
//                    .flatMap(i -> checkHealth())
//                    .onErrorResume(e -> Flux.just(new ArrayList<>())); // Return empty list on error
//        }
//
//        private Flux<List<ServiceInstance>> checkHealth() {
//            // Perform health check for each instance
//            List<Flux<ServiceInstance>> healthChecks = instances.stream()
//                    .map(instance -> webClient.get()
//                            .uri("http://" + instance.getHost() + ":" + instance.getPort() + "/actuator/health")
//                            .retrieve()
//                            .toBodilessEntity()
//                            .map(response -> {
//                                // If status is OK, include this instance
//                                if (response.getStatusCode() == HttpStatus.OK) {
//                                    return instance;
//                                }
//                                return null;
//                            })
//                            .onErrorReturn(null) // On failure, exclude instance
//                    )
//                    .collect(Collectors.toList());
//
//            // Collect all healthy instances
//            return Flux.combineLatest(healthChecks, results -> Arrays.stream(results)
//                    .filter(result -> result != null) // Remove null (unhealthy) instances
//                    .map(result -> (ServiceInstance) result)
//                    .collect(Collectors.toList())
//            );
//        }
//    }
//}
