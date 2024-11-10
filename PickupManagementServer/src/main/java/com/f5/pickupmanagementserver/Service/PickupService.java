package com.f5.pickupmanagementserver.Service;

import com.f5.pickupmanagementserver.DTO.*;
import com.f5.pickupmanagementserver.DTO.Request.UpdatePickupDTO;
import com.f5.pickupmanagementserver.DTO.Respons.MyPickupDTO;
import com.f5.pickupmanagementserver.DTO.Respons.PickupDetailsDTO;
import com.f5.pickupmanagementserver.DTO.Respons.PickupInfoMsgDTO;

import java.util.List;

public interface PickupService {
    PickupInfoMsgDTO addPickup(NewPickupDTO newPickupDTO, AddressDTO addressDTO, List<DetailsDTO> details);
    List<MyPickupDTO> getMyPickups(String email);
    List<MyPickupDTO> getAllPickups();
    PickupDetailsDTO getDetails(Long pickupId);
    void updatePickup(UpdatePickupDTO updatePickupDTO);
    void deletePickup(Long pickupId);
}
