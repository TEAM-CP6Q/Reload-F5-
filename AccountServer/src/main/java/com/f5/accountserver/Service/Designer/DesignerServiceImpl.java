package com.f5.accountserver.Service.Designer;

import com.f5.accountserver.DAO.Designer.DesignerDAO;
import com.f5.accountserver.DTO.DesignerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DesignerServiceImpl implements DesignerService {
    private final DesignerDAO designerDAO;

    @Autowired
    public DesignerServiceImpl(DesignerDAO designerDAO) {
        this.designerDAO = designerDAO;
    }

    @Override
    public void addDesigner(DesignerDTO designerDTO) {
        try{
            designerDAO.saveDesigner(designerDTO);
        } catch (Exception e) {
            throw new IllegalStateException("디자이너 저장 실패");
        }
    }

    @Override
    public void deleteDesigner(String designerName) {
        try{
            designerDAO.removeDesigner(designerName);
        } catch (Exception e){
            throw new IllegalStateException("디자이너 삭제 실패");
        }
    }
}
