package com.f5.authserver.Controller;

import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.Entity.DormantEntity;
import com.f5.authserver.Entity.UserEntity;
import com.f5.authserver.JWT.JwtTokenUtil;
import com.f5.authserver.Repository.DormantRepository;
import com.f5.authserver.Service.Communication.AccountCommunicationService;
import com.f5.authserver.Service.User.CustomUserDetailsService;
import com.f5.authserver.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
//@CrossOrigin(origins = {"http://127.0.0.1:3000", "http://192.168.0.11:3000", "http://121.182.42.161:8000"})
public class LoginController {
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService customUserDetailsService;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserService userService;
    private final DormantRepository dormantRepository;
    private final AccountCommunicationService accountCommunicationService;


    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody UserDTO user) throws AuthenticationException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        final String token = jwtTokenUtil.generateToken(userDetails.getUsername());

        // UserEntity를 서비스 메서드를 통해 가져옴
        UserEntity loggedInUser = userService.getLoggedInUserEntity(user.getEmail());

        if(loggedInUser.getUserId() == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", loggedInUser);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(403).body("카카오 계정으로 로그인 해주세요.");
        }
    }

    // 원래 이렇게 하면 안돼지만 귀찮으므로 걍 함
    @GetMapping("/user-info/{email}")
    public ResponseEntity<?> userInfo(@PathVariable String email) {
        UserEntity user = userService.getLoggedInUserEntity(email);
        return ResponseEntity.ok(user);
    }

    @PatchMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody UserDTO user) {
        try {
            // 아이디와 비밀번호 인증
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );

            // 인증 성공 시 탈퇴 로직 진행
            userService.dormantAccount(user);
            return ResponseEntity.ok("탈퇴 성공");

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("아이디 또는 비밀번호가 올바르지 않습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류 발생");
        }
    }

    @GetMapping("/dormant-accounts")
    public ResponseEntity<?> dormantAccounts() {
        try{
            List<DormantEntity> dormantEntities = dormantRepository.findAll();
            return ResponseEntity.ok(dormantEntities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

//    @GetMapping("/get-all-users")
//    public ResponseEntity<?> getAll() {
//        try{
//
//        }
//    }

//    @DeleteMapping("/withdraw/{username}")
//    public ResponseEntity<?> withdraw(@PathVariable String username) {
//        try{
//            userService.dormantAccount(username);
//            return ResponseEntity.ok("탈퇴 성공");
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }

//    @PatchMapping("/withdraw")
//    public ResponseEntity<?> withdraw(@RequestBody UserDTO user) {
//        try{
//            userService.dormantAccount(user);
//            return ResponseEntity.ok("탈퇴 성공");
//        } catch (IllegalArgumentException e) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
//        }
//    }
}
