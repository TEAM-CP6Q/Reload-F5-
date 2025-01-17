package com.f5.pickupserver.Controller;

import com.f5.pickupserver.DTO.*;
import com.f5.pickupserver.DTO.Request.LocationDTO;
import com.f5.pickupserver.DTO.Request.UpdatePickupDTO;
import com.f5.pickupserver.DTO.Respons.StatusCodeDTO;
import com.f5.pickupserver.Service.PickupService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pickup")
public class PickupController {
    private final PickupService pickupService;

    public PickupController(PickupService pickupService) {
        this.pickupService = pickupService;
    }

    @PostMapping("/new-pickup")
    public ResponseEntity<?> newPickup(@RequestBody Map<String, Object> request) {
        try {
            // pickupInfo 정보를 NewPickupDTO로 변환
            ObjectMapper mapper = new ObjectMapper();
            NewPickupDTO newPickupDTO = mapper.convertValue(request.get("Info"), NewPickupDTO.class);
            System.out.println(new ObjectMapper().writeValueAsString(newPickupDTO));

            AddressDTO addressDTO = mapper.convertValue(request.get("Address"), AddressDTO.class);
            System.out.println(new ObjectMapper().writeValueAsString(addressDTO));

            // details 리스트를 List<DetailsDTO>로 변환
            List<DetailsDTO> detailsList = mapper.convertValue(request.get("Details"),
                    new TypeReference<List<DetailsDTO>>() {});

            return ResponseEntity.ok(pickupService.addPickup(newPickupDTO, addressDTO, detailsList));
        } catch (Exception e) {
            return ResponseEntity.status(405).body(StatusCodeDTO.builder()
                            .code(405L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/my-pickup")
    public ResponseEntity<?> getMyPickup(@RequestParam("email") String email) {
        try{
            return ResponseEntity.ok().body(pickupService.getMyPickups(email));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/get-details")
    public ResponseEntity<?> getDetails(@RequestParam("pickupId") Long pickupId) {
        try{
            return ResponseEntity.ok().body(pickupService.getDetails(pickupId));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/get-all-pickups")
    public ResponseEntity<?> getAllPickups() {
        try{
            return ResponseEntity.ok().body(pickupService.getAllPickups());
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @PatchMapping("/update-pickup")
    public ResponseEntity<?> updatePickup(@RequestBody UpdatePickupDTO request) {
        try{
            pickupService.updatePickup(request);
            return ResponseEntity.ok().body(StatusCodeDTO.builder()
                            .code(200L)
                            .msg("업데이트 성공")
                            .build());
        } catch (Exception e){
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @DeleteMapping("/delete-pickup")
    public ResponseEntity<?> deletePickup(@RequestParam("pickupId") Long pickupId) {
        try{
            pickupService.deletePickup(pickupId);
            return ResponseEntity.ok(StatusCodeDTO.builder()
                            .code(200L)
                            .msg("수거 신청 삭제 성공")
                            .build());
        } catch (Exception e){
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @PostMapping("/update-location")
    public ResponseEntity<?> updateLocation(@RequestBody LocationDTO request) {
        try{
            pickupService.updateLocation(request);
            return ResponseEntity.ok(StatusCodeDTO.builder()
                            .code(200L)
                            .msg("위치 업데이트 성공")
                            .build());
        }catch (Exception e){
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/get-location")
    public ResponseEntity<?> getLocation(@RequestParam("pickupId") Long pickupId) {
        try{
            return ResponseEntity.ok(pickupService.getLocation(pickupId));
        } catch (Exception e){
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/get-today-pickup")
    public ResponseEntity<?> getTodayPickup(@RequestParam("today") String today) {
        try{
            return ResponseEntity.ok(pickupService.getTodayPickups(today));
        } catch (Exception e){
            return ResponseEntity.status(402).body(StatusCodeDTO.builder()
                            .code(402L)
                            .msg(e.getMessage())
                            .build());
        }
    }

    @DeleteMapping("/delete-location")
    public ResponseEntity<?> deleteLocation(@RequestParam("pickupId") Long pickupId) {
        try{
            pickupService.deleteLocation(pickupId);
            return ResponseEntity.ok(StatusCodeDTO.builder()
                            .code(200L)
                            .msg("기사 위치 삭제 성공")
                            .build());
        } catch (Exception e){
            return ResponseEntity.status(402).body(StatusCodeDTO.builder()
                            .code(402L)
                            .msg(e.getMessage())
                            .build());
        }
    }
}
