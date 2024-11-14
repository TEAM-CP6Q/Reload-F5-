package com.f5.accountserver.Service.Designer;

import com.f5.accountserver.DTO.DesignerDTO;

import java.util.List;

public interface DesignerService {
    void addDesigner(DesignerDTO designerDTO);
    void deleteDesigner(Long id);
    DesignerDTO getDesigner(Long id);
    List<DesignerDTO> getDesignerList();
    DesignerDTO updateDesigner(DesignerDTO designerDTO);
}
