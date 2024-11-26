package com.f5.authserver.Controller;

import com.f5.authserver.DTO.StatusCodeDTO;
import com.f5.authserver.DTO.User.UserDTO;
import com.f5.authserver.Entity.UserEntity;
import com.f5.authserver.JWT.JwtTokenUtil;
import com.f5.authserver.Service.Communication.AccountCommunicationService;
import com.f5.authserver.Service.User.CustomUserDetailsService;
import com.f5.authserver.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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
    private final AccountCommunicationService accountCommunicationService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserDTO user) throws AuthenticationException {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        final UserDetails userDetails = customUserDetailsService.loadUserByUsername(user.getEmail());
        final String token = jwtTokenUtil.generateToken(userDetails.getUsername());

        // UserEntity를 서비스 메서드를 통해 가져옴
        UserEntity loggedInUser = userService.getLoggedInUserEntity(user.getEmail());

        if(!loggedInUser.getKakao()) {
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", loggedInUser);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.ok().body(StatusCodeDTO.builder()
                            .Code(400L)
                            .Msg("카카오 계정으로 로그인 해주세요.")
                            .build());
        }
    }

    // 원래 이렇게 하면 안돼지만 귀찮으므로 걍 함
    @GetMapping("/user-info/{email}")
    public ResponseEntity<?> userInfo(@PathVariable String email) throws IllegalStateException {
        return ResponseEntity.ok(userService.getLoggedInUserEntity(email));
    }

    @DeleteMapping("/withdraw")
    public ResponseEntity<?> withdraw(@RequestBody UserDTO user) {
        try {
            // 아이디와 비밀번호 인증
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
            );

            // 인증 성공 시 탈퇴 로직 진행
            userService.deleteAccount(user);
            return ResponseEntity.ok(StatusCodeDTO.builder()
                            .Code(200L)
                            .Msg("탈퇴 성공")
                            .build());

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(StatusCodeDTO.builder()
                            .Code(401L)
                            .Msg("아이디 또는 비밀번호가 올바르지 않습니다.")
                            .build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body(StatusCodeDTO.builder()
                            .Code(403L)
                            .Msg("탈퇴 실패")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.status(500).body(StatusCodeDTO.builder()
                            .Code(500L)
                            .Msg("서버 오류 발생")
                            .build());
        }
    }

    @GetMapping("/email/{id}")
    public ResponseEntity<?> emails(@PathVariable Long id) {
        try{
            return ResponseEntity.ok(userService.getEmailById(id));
        } catch (Exception e) {
            return ResponseEntity.ok().body(StatusCodeDTO.builder()
                            .Code(400L)
                            .Msg(e.getMessage())
                            .build());
        }
    }
}
