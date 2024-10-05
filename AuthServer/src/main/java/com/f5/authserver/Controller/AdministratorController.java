package com.f5.authserver.Controller;

import com.f5.authserver.DTO.AdministratorDTO;
import com.f5.authserver.Entity.AdministratorEntity;
import com.f5.authserver.JWT.JwtTokenUtil;
import com.f5.authserver.Service.Administrator.AdministratorService;
import com.f5.authserver.Service.User.CustomUserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.6:3000"})
public class AdministratorController {
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final AdministratorService administratorService;

    public AdministratorController(AuthenticationManager authenticationManager, CustomUserDetailsService customUserDetailsService, JwtTokenUtil jwtTokenUtil, AdministratorService administratorService) {
        this.authenticationManager = authenticationManager;
        this.customUserDetailsService = customUserDetailsService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.administratorService = administratorService;
    }


    // Spring Security 의 UserDetails 를 이용한 JWT 토큰 발급 후 리턴
    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AdministratorDTO admin) throws AuthenticationException {
        // adminCode를 통한 인증 처리
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(admin.getAdminCode(), null));

        // UserDetails로부터 JWT 토큰 생성
        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(admin.getAdminCode());
        final String token = jwtTokenUtil.generateToken(userDetails.getUsername());

        AdministratorEntity loggedInAdmin = administratorService.getLoggedInAdministratorEntity(admin.getAdminCode());

        // 응답에 JWT 토큰과 사용자 정보 담기
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("user", loggedInAdmin);

        return ResponseEntity.ok(response);
    }

    // 쓸 일이 있으려나 싶지만 일단 어드민 추가
    @PostMapping("/register")
    public ResponseEntity<?> addAdmin(@RequestBody AdministratorDTO admin) throws AuthenticationException {
        try{
            AdministratorDTO saveAdmin = administratorService.addAdministrator(admin);
            return ResponseEntity.ok(saveAdmin);
        } catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}

