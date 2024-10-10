package com.f5.accountserver.Controller;

import com.f5.accountserver.DTO.UserDetailDTO;
import com.f5.accountserver.Service.UserDetails.UserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class CommunicationController {
    private final UserDetailsService userDetailsService;

    public CommunicationController(UserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/add-details")
    public ResponseEntity<?> addUserDetails(@RequestBody UserDetailDTO details) {
        try{
                userDetailsService.saveUserDetails(details);
                return ResponseEntity.ok("저장 성공");
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
