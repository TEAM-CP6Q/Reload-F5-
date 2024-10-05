package com.f5.authserver.Controller;

import com.f5.authserver.DTO.RegisterDTO;
import com.f5.authserver.DTO.UserDTO;
import com.f5.authserver.DTO.UserDetailDTO;
import com.f5.authserver.Service.Communication.AccountCommunicationService;
import com.f5.authserver.Service.User.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/register")
@CrossOrigin(origins = {"http://localhost:3000", "http://192.168.0.6:3000"})
public class RegisterController {
    private final UserService userService;
    private final AccountCommunicationService accountCommunicationService;

    @PostMapping
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        UserDTO userDTO = UserDTO.builder()
                .username(registerDTO.getUsername())
                .password(registerDTO.getPassword())
                .build();
        UserDetailDTO userDetailDTO = UserDetailDTO.builder()
                .name(registerDTO.getName())
                .postalCode(registerDTO.getPostalCode())
                .roadNameAddress(registerDTO.getRoadNameAddress())
                .detailedAddress(registerDTO.getDetailedAddress())
                .email(registerDTO.getEmail())
                .phoneNumber(registerDTO.getPhoneNumber())
                .build();
        try {
            UserDTO savedUser = userService.registerUser(userDTO);
            accountCommunicationService.registerAccount(userDetailDTO);
            return ResponseEntity.ok(savedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
