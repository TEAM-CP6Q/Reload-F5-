package com.f5.authserver.Controller;

import com.f5.authserver.DAO.User.UserDAO;
import com.f5.authserver.DTO.RegisterDTO;
import com.f5.authserver.DTO.UserDTO;
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
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/exist-email/{email}")
    public ResponseEntity<?> existEmail(@PathVariable String email) {
        if(userDAO.existsByEmail(email)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("이미 존재하는 이메일");
        } else return ResponseEntity.ok("사용 가능한 이메일");
    }
}
