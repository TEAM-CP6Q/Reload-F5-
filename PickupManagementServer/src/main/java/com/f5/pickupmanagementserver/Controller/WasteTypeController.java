package com.f5.pickupmanagementserver.Controller;

import com.f5.pickupmanagementserver.DTO.Respons.StatusCodeDTO;
import com.f5.pickupmanagementserver.DTO.WasteTypeDTO;
import com.f5.pickupmanagementserver.Service.WasteTypeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/pickup/waste")
public class WasteTypeController {
    private final WasteTypeService wasteTypeService;

    public WasteTypeController(WasteTypeService wasteTypeService) {
        this.wasteTypeService = wasteTypeService;
    }

    @GetMapping("/type-list")
    public ResponseEntity<?> getWasteTypeList() {
        LinkedHashMap<String, List<WasteTypeDTO>> response = new LinkedHashMap<>();
        try{
            List<WasteTypeDTO> items = new ArrayList<>();
            items.add(WasteTypeDTO.builder()
                            .id("PL").type("플라스틱").description("kg당 평균 단가").price(644L)
                            .build());
            items.add(WasteTypeDTO.builder()
                    .id("GL").type("유리").description("kg당 평균 단가").price(110L)
                    .build());
            items.add(WasteTypeDTO.builder()
                    .id("CN").type("캔").description("kg당 평균 단가").price(918L)
                    .build());
            response.put("재활용품", items);
            response.put("생활용품", wasteTypeService.getWasteList("DailySupplies"));
            response.put("생활가구", wasteTypeService.getWasteList("HouseholdAppliances"));
            response.put("기타용품", wasteTypeService.getWasteList("HouseholdFurniture"));
            response.put("생활가전", wasteTypeService.getWasteList("OtherItems"));
            log.info("폐기물 타입 불러오기 성공");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .code(404L)
                            .msg(e.getMessage())
                            .build());
        }
    }
}
