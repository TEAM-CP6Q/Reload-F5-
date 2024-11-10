package com.f5.pickupmanagementserver.DAO;

import com.f5.pickupmanagementserver.DTO.*;
import com.f5.pickupmanagementserver.DTO.Request.UpdatePickupDTO;
import com.f5.pickupmanagementserver.DTO.Respons.MyPickupDTO;
import com.f5.pickupmanagementserver.DTO.Respons.PickupDetailsDTO;
import com.f5.pickupmanagementserver.DTO.Respons.PickupInfoMsgDTO;

import java.util.List;

public interface PickupDAO {
    PickupInfoMsgDTO createPickup(NewPickupDTO newPickup, AddressDTO addressDTO, List<DetailsDTO> details);
    List<MyPickupDTO> findUserPickupList(String email);
    List<MyPickupDTO> findAllPickupList();
    PickupDetailsDTO findPickupDetails(Long pickupId);
    void updatePickup(UpdatePickupDTO updatePickup);
    void removePickup(Long pickupId);
}
