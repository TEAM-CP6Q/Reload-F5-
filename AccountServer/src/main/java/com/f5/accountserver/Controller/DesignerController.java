package com.f5.accountserver.Controller;

import com.f5.accountserver.DTO.DesignerDTO;
import com.f5.accountserver.Service.Designer.DesignerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account/designer")
public class DesignerController {
    private final DesignerService designerService;

    public DesignerController(DesignerService designerService) {
        this.designerService = designerService;
    }

    @PostMapping("/add-designer")
    public ResponseEntity<?> addDesigner(@RequestBody DesignerDTO designerDTO) {
        try {
            designerService.addDesigner(designerDTO);
            return ResponseEntity.ok("디자이너 저장 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/remove-designer/{designerName}")
    public ResponseEntity<?> removeDesigner(@PathVariable("designerName") String designerName) {
        try {
            designerService.deleteDesigner(designerName);
            return ResponseEntity.ok("디자이너 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
