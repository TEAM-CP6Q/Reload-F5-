package com.f5.accountserver.DAO.Designer;

import com.f5.accountserver.DTO.DesignerDTO;

public interface DesignerDAO {
    void saveDesigner(DesignerDTO designerDTO);
    void removeDesigner(String designerName);
}
