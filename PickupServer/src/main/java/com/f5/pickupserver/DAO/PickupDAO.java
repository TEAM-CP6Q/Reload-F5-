package com.f5.pickupserver.DAO;

import com.f5.pickupserver.DTO.*;
import com.f5.pickupserver.DTO.Request.LocationDTO;
import com.f5.pickupserver.DTO.Request.UpdatePickupDTO;
import com.f5.pickupserver.DTO.Respons.MyPickupDTO;
import com.f5.pickupserver.DTO.Respons.PickupDetailsDTO;
import com.f5.pickupserver.DTO.Respons.PickupInfoMsgDTO;

import java.util.List;

public interface PickupDAO {
    PickupInfoMsgDTO createPickup(NewPickupDTO newPickup, AddressDTO addressDTO, List<DetailsDTO> details);
    List<MyPickupDTO> findUserPickupList(String email);
    List<MyPickupDTO> findAllPickupList();
    PickupDetailsDTO findPickupDetails(Long pickupId);
    void updatePickup(UpdatePickupDTO updatePickup);
    void removePickup(Long pickupId);
    void changeLocation(LocationDTO locationDTO);
    LocationDTO getPickupLocation(Long pickupId);
}
