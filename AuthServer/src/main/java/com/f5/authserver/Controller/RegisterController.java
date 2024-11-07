package com.f5.authserver.Controller;

import com.f5.authserver.DAO.User.UserDAO;
import com.f5.authserver.DTO.Auth.RegisterDTO;
import com.f5.authserver.DTO.StatusCodeDTO;
import com.f5.authserver.DTO.User.UserDTO;
import com.f5.authserver.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth/register")
public class RegisterController {
    private final UserService userService;
    private final UserDAO userDAO;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        try {
            UserDTO savedUser = userService.registerUser(registerDTO);
            return ResponseEntity.ok(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg(e.getMessage())
                            .build());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(405).body(StatusCodeDTO.builder()
                            .Code(405L)
                            .Msg(e.getMessage())
                            .build());
        }
    }

//    @PatchMapping("/rollback-account")
//    public ResponseEntity<?> rollbackAccount(@RequestBody RegisterDTO registerDTO) {
//        return ResponseEntity.ok();
//    }



    @GetMapping("/exist-email/{email}")
    public ResponseEntity<?> existEmail(@PathVariable String email) {
        if(userDAO.existsByEmail(email)) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg("이미 존재하는 이메일")
                            .build());
        } else return ResponseEntity.ok(StatusCodeDTO.builder()
                        .Code(200L)
                        .Msg("사용 가능한 이메일")
                        .build());
    }
}
