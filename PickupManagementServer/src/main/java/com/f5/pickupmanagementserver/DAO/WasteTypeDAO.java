package com.f5.pickupmanagementserver.DAO;

import com.f5.pickupmanagementserver.DTO.WasteTypeDTO;

import java.util.List;

public interface WasteTypeDAO {
    List<WasteTypeDTO> getWasteTypes(String fileName);
}
