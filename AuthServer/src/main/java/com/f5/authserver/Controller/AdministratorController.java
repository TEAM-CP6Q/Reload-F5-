package com.f5.authserver.Controller;

import com.f5.authserver.DTO.Auth.AdminLoginDTO;
import com.f5.authserver.DTO.StatusCodeDTO;
import com.f5.authserver.DTO.User.AdministratorDTO;
import com.f5.authserver.Entity.AdministratorEntity;
import com.f5.authserver.JWT.JwtTokenUtil;
import com.f5.authserver.Repository.AdministratorRepository;
import com.f5.authserver.Service.Administrator.AdministratorService;
import com.f5.authserver.Service.User.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/admin")
//@CrossOrigin(origins = {"http://127.0.0.1:3000", "http://192.168.0.11:3000", "http://121.182.42.161:8000"})
public class AdministratorController {
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final AdministratorService administratorService;
    private final AdministratorRepository administratorRepository;

    public AdministratorController(PasswordEncoder passwordEncoder, AuthenticationManager authenticationManager, CustomUserDetailsService customUserDetailsService, JwtTokenUtil jwtTokenUtil, AdministratorService administratorService, AdministratorRepository administratorRepository) {
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.administratorService = administratorService;
        this.administratorRepository = administratorRepository;
    }


    // Spring Security 의 UserDetails 를 이용한 JWT 토큰 발급 후 리턴
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AdminLoginDTO admin) throws AuthenticationException {
        // 전체 어드민 리스트 가져오기
        List<AdministratorEntity> adminList = administratorRepository.findAll();

        // 일치하는 adminCode를 가진 어드민 찾기
        AdministratorEntity adminEntity = adminList.stream()
                .filter(a -> passwordEncoder.matches(admin.getAdminCode(), a.getAdminCode()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 어드민을 찾을 수 없습니다."));

        // 인증 처리
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(adminEntity.getAdminName(), admin.getAdminCode())
        );

        // UserDetails로부터 JWT 토큰 생성
        final UserDetails adminDetails = customUserDetailsService.loadUserByUsername(adminEntity.getAdminName());
        final String token = jwtTokenUtil.generateToken(adminDetails.getUsername());

        // 어드민 정보와 JWT 토큰 응답
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("admin", adminEntity);

        return ResponseEntity.ok(response);
    }

    // 쓸 일이 있으려나 싶지만 일단 어드민 추가
    @PostMapping("/register")
    public ResponseEntity<?> addAdmin(@RequestBody AdministratorDTO admin) throws AuthenticationException {
        try{
            AdministratorDTO saveAdmin = administratorService.addAdministrator(admin);
            return ResponseEntity.ok(saveAdmin);
        } catch (Exception e){
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg(e.getMessage())
                            .build());
        }
    }
}

