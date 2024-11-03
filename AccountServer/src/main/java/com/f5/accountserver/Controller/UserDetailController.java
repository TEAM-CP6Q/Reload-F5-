package com.f5.accountserver.Controller;

import com.f5.accountserver.DTO.UserDetailDTO;
import com.f5.accountserver.Entity.DormantEntity;
import com.f5.accountserver.Repository.DormantRepository;
import com.f5.accountserver.Service.Communication.CommunicationService;
import com.f5.accountserver.Service.UserDetails.UserDetailsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/account")
public class UserDetailController {
    private final UserDetailsService userDetailsService;
    private final CommunicationService communicationService;
    private final DormantRepository dormantRepository;

    public UserDetailController(UserDetailsService userDetailsService, CommunicationService communicationService, DormantRepository dormantRepository) {
        this.userDetailsService = userDetailsService;
        this.communicationService = communicationService;
        this.dormantRepository = dormantRepository;
    }

    @GetMapping("/search-account/{email}")
    public ResponseEntity<?> getUserDetail(@PathVariable String email) {
        try{
            UserDetailDTO user = userDetailsService.getUserDetails(communicationService.searchInfo(email));
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PatchMapping("/update-account")
    public ResponseEntity<?> updateAccount(@RequestBody UserDetailDTO userDetailDTO) {
        try {
            userDetailsService.updateUserDetails(userDetailDTO);  // 서비스 레이어에서 업데이트 처리
            return ResponseEntity.ok("유저 상세 정보가 성공적으로 업데이트되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("유저 상세 정보 업데이트에 실패했습니다.");
        }
    }

    @DeleteMapping("/withdraw/{id}")
    public ResponseEntity<?> withdraw(@PathVariable Long id) {
        try{
            userDetailsService.dormantAccount(id);
            return ResponseEntity.ok("탈퇴 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping("/dormant-accounts")
    public ResponseEntity<?> getDormantAccounts() {
        try{
            List<DormantEntity> dormantEntities = dormantRepository.findAll();
            return ResponseEntity.ok(dormantEntities);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}
