package com.f5.accountserver.Service.Designer;

import com.f5.accountserver.DTO.DesignerDTO;

public interface DesignerService {
    void addDesigner(DesignerDTO designerDTO);
    void deleteDesigner(String designerName);
}
