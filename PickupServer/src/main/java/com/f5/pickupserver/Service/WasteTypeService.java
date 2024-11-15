package com.f5.pickupserver.Service;

import com.f5.pickupserver.DTO.WasteTypeDTO;

import java.util.List;

public interface WasteTypeService {
    List<WasteTypeDTO> getWasteList(String fileName);
}
