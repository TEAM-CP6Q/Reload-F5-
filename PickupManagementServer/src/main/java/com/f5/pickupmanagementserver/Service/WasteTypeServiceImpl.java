package com.f5.pickupmanagementserver.Service;

import com.f5.pickupmanagementserver.DAO.WasteTypeDAO;
import com.f5.pickupmanagementserver.DTO.WasteTypeDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class WasteTypeServiceImpl implements WasteTypeService {

    private final WasteTypeDAO wasteTypeDAO;

    public WasteTypeServiceImpl(WasteTypeDAO wasteTypeDAO) {
        this.wasteTypeDAO = wasteTypeDAO;
    }

    public List<WasteTypeDTO> getWasteList(String fileName) {
        try{
            return wasteTypeDAO.getWasteTypes(fileName);
        } catch (Exception e){
            throw new IllegalStateException("폐기물 리스트 로드 실패 " + fileName);
        }
    }
}
