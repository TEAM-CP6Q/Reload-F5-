package com.f5.pickupserver.DAO;

import com.f5.pickupserver.DTO.WasteTypeDTO;

import java.util.List;

public interface WasteTypeDAO {
    List<WasteTypeDTO> getWasteTypes(String fileName);
}
