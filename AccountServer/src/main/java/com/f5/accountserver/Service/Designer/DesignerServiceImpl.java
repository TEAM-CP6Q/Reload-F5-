package com.f5.accountserver.Service.Designer;

import com.f5.accountserver.DAO.Designer.DesignerDAO;
import com.f5.accountserver.DTO.DesignerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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
            throw new IllegalStateException(e.getMessage());
        }
    }

    @Override
    public void deleteDesigner(Long id) {
        try{
            designerDAO.removeDesigner(id);
        } catch (Exception e){
            throw new IllegalStateException(e.getMessage());
        }
    }

    @Override
    public DesignerDTO getDesigner(Long id) {
        try {
            return designerDAO.getDesigner(id);
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    @Override
    public List<DesignerDTO> getDesignerList() {
        try{
            return designerDAO.getDesigners();
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
    }

    @Override
    public DesignerDTO updateDesigner(DesignerDTO designerDTO) {
        try{
            return designerDAO.update(designerDTO);
        } catch (Exception e){
            throw new IllegalStateException(e.getMessage());
        }
    }
}
