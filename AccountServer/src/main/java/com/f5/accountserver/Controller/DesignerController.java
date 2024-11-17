package com.f5.accountserver.Controller;

import com.f5.accountserver.DTO.DesignerDTO;
import com.f5.accountserver.DTO.StatusCodeDTO;
import com.f5.accountserver.Service.Designer.DesignerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

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
            return ResponseEntity.ok(StatusCodeDTO.builder()
                            .Code(200L)
                            .Msg("디자이너 저장 성공")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg(e.getMessage())
                            .build());
        }
    }

    @DeleteMapping("/remove-designer")
    public ResponseEntity<?> removeDesigner(@RequestParam("id") Long id) {
        try {
            designerService.deleteDesigner(id);
            return ResponseEntity.ok(StatusCodeDTO.builder()
                            .Code(200L)
                            .Msg("삭제 성공")
                            .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/get-designer")
    public ResponseEntity<?> getDesigner(@RequestParam("id") Long id) {
        try{
            return ResponseEntity.ok(designerService.getDesigner(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg(e.getMessage())
                            .build());
        }
    }

    @GetMapping("/all-designer")
    public ResponseEntity<?> getAllDesigner() {
        try{
            return ResponseEntity.ok(Objects.requireNonNull(designerService.getDesignerList()));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg(e.getMessage())
                            .build());
        }
    }

    @PatchMapping("/update-designer")
    public ResponseEntity<?> updateDesigner(@RequestBody DesignerDTO designerDTO) {
        try{
            return ResponseEntity.ok(designerService.updateDesigner(designerDTO));
        } catch (Exception e){
            return ResponseEntity.status(404).body(StatusCodeDTO.builder()
                            .Code(404L)
                            .Msg(e.getMessage())
                            .build());
        }
    }
}
