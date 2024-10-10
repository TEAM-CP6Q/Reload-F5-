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

    @GetMapping("/exist-username/{username}")
    public ResponseEntity<?> existUsername(@PathVariable String username) {
        if(userDAO.existsByUsername(username)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("중복된 아이디");
        } else return ResponseEntity.ok("사용 가능한 아이디");
    }

}
