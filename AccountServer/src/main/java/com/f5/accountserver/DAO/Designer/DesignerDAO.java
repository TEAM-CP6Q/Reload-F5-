package com.f5.accountserver.DAO.Designer;

import com.f5.accountserver.DTO.DesignerDTO;

import java.util.List;

public interface DesignerDAO {
    void saveDesigner(DesignerDTO designerDTO);
    void removeDesigner(Long id);
    DesignerDTO getDesigner(Long id);
    List<DesignerDTO> getDesigners();
    DesignerDTO update(DesignerDTO designerDTO);
}
