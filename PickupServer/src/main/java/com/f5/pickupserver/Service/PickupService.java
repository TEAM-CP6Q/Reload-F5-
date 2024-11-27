package com.f5.pickupserver.Service;

import com.f5.pickupserver.DTO.*;
import com.f5.pickupserver.DTO.Request.LocationDTO;
import com.f5.pickupserver.DTO.Request.UpdatePickupDTO;
import com.f5.pickupserver.DTO.Respons.MyPickupDTO;
import com.f5.pickupserver.DTO.Respons.PickupDetailsDTO;
import com.f5.pickupserver.DTO.Respons.PickupInfoMsgDTO;

import java.util.List;

public interface PickupService {
    PickupInfoMsgDTO addPickup(NewPickupDTO newPickupDTO, AddressDTO addressDTO, List<DetailsDTO> details);
    List<MyPickupDTO> getMyPickups(String email);
    List<MyPickupDTO> getAllPickups();
    PickupDetailsDTO getDetails(Long pickupId);
    void updatePickup(UpdatePickupDTO updatePickupDTO);
    void deletePickup(Long pickupId);
    void updateLocation(LocationDTO locationDTO);
    LocationDTO getLocation(Long pickupId);
    List<DeliverPickupDTO> getTodayPickups(String today);
}
