package com.f5.pickupmanagementserver.Service;

import com.f5.pickupmanagementserver.DTO.WasteTypeDTO;

import java.util.List;

public interface WasteTypeService {
    List<WasteTypeDTO> getWasteList(String fileName);
}
