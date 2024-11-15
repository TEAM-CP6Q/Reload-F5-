package com.f5.pickupserver.Service;

import com.f5.pickupserver.DAO.PickupDAO;
import com.f5.pickupserver.DTO.*;
import com.f5.pickupserver.DTO.Request.LocationDTO;
import com.f5.pickupserver.DTO.Request.UpdatePickupDTO;
import com.f5.pickupserver.DTO.Respons.MyPickupDTO;
import com.f5.pickupserver.DTO.Respons.PickupDetailsDTO;
import com.f5.pickupserver.DTO.Respons.PickupInfoMsgDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PickupServiceImpl implements PickupService {
    private final PickupDAO pickupDAO;

    public PickupServiceImpl(PickupDAO pickupDAO) {
        this.pickupDAO = pickupDAO;
    }

    @Override
    public PickupInfoMsgDTO addPickup(NewPickupDTO newPickupDTO, AddressDTO addressDTO, List<DetailsDTO> details)
            throws IllegalArgumentException {
        return pickupDAO.createPickup(newPickupDTO, addressDTO, details);
    }

    @Override
    public List<MyPickupDTO> getMyPickups(String email) {
        try {
            return pickupDAO.findUserPickupList(email);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public PickupDetailsDTO getDetails(Long pickupId)
            throws IllegalArgumentException {
        try {
            return pickupDAO.findPickupDetails(pickupId);
        } catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public List<MyPickupDTO> getAllPickups(){
        try{
            return pickupDAO.findAllPickupList();
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void updatePickup(UpdatePickupDTO updatePickupDTO)
            throws IllegalStateException{
        try{
            pickupDAO.updatePickup(updatePickupDTO);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void deletePickup(Long pickupId)
            throws IllegalStateException{
        try{
            pickupDAO.removePickup(pickupId);
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void updateLocation(LocationDTO locationDTO) throws IllegalStateException{
        try{
            pickupDAO.changeLocation(locationDTO);
        } catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public LocationDTO getLocation(Long pickupId){
        try{
            return pickupDAO.getPickupLocation(pickupId);
        } catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }
}
