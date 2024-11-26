package com.f5.pickupserver.DAO;

import com.f5.pickupserver.DTO.*;
import com.f5.pickupserver.DTO.Request.LocationDTO;
import com.f5.pickupserver.DTO.Request.UpdateDetailsDTO;
import com.f5.pickupserver.DTO.Request.UpdatePickupDTO;
import com.f5.pickupserver.DTO.Respons.DetailsResponseDTO;
import com.f5.pickupserver.DTO.Respons.MyPickupDTO;
import com.f5.pickupserver.DTO.Respons.PickupDetailsDTO;
import com.f5.pickupserver.DTO.Respons.PickupInfoMsgDTO;
import com.f5.pickupserver.Entity.AddressEntity;
import com.f5.pickupserver.Entity.DetailsEntity;
import com.f5.pickupserver.Entity.PickupListEntity;
import com.f5.pickupserver.Repository.AddressRepository;
import com.f5.pickupserver.Repository.DetailsRepository;
import com.f5.pickupserver.Repository.LocationRepository;
import com.f5.pickupserver.Repository.PickupListRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Component;

import org.springframework.core.io.ClassPathResource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;

@Component
@Transactional
public class PickupDAOImpl implements PickupDAO {
    private final PickupListRepository pickupListRepository;
    private final DetailsRepository detailsRepository;
    private final AddressRepository addressRepository;
    private final LocationRepository locationRepository;

    public PickupDAOImpl(PickupListRepository pickupListRepository, DetailsRepository detailsRepository, AddressRepository addressRepository, LocationRepository locationRepository) {
        this.pickupListRepository = pickupListRepository;
        this.detailsRepository = detailsRepository;
        this.addressRepository = addressRepository;
        this.locationRepository = locationRepository;
    }

    @Override
    public PickupInfoMsgDTO createPickup(NewPickupDTO newPickup, AddressDTO addressDTO, List<DetailsDTO> details) throws IllegalArgumentException {
        PickupListEntity pickupList = new PickupListEntity();
        pickupList.setNotes(newPickup.getNotes());
        pickupList.setPricePreview(newPickup.getPricePreview());
        pickupList.setPayment(false);
        LocalDateTime formatLocalDateTime =
                LocalDateTime.parse(newPickup.getPickupDate(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        pickupList.setPickupDate(formatLocalDateTime);
        pickupList.setRequestDate(LocalDate.now());
        pickupList.setPickupProgress(false);
        pickupList.setAccepted(false);
        List<String> userInfo;
        try {
            pickupListRepository.save(pickupList);
        } catch (Exception e) {
            throw new IllegalArgumentException("수거 신청 저장에 실패했습니다.");
        } try{
            userInfo = addAddress(addressDTO, pickupList);
        } catch (Exception e) {
            pickupListRepository.delete(pickupList);
            throw new IllegalArgumentException(e.getMessage());
        } try {
            addDetails(details, pickupList);
        } catch (Exception e) {
            pickupListRepository.delete(pickupList);
            AddressEntity addressEntity = addressRepository.findByPickupList(pickupList);
            addressRepository.delete(addressEntity);
            throw new IllegalArgumentException(e.getMessage());
        }
        return PickupInfoMsgDTO.builder()
                .pickupId(pickupList.getPickupId())
                .name(userInfo.get(0))
                .email(userInfo.get(1))
                .build();
    }

    private List<String> addAddress(AddressDTO addressDTO, PickupListEntity pickupList) {
        try{
            AddressEntity addressEntity = getAddressEntity(addressDTO, pickupList);
            List<String> userInfo = new ArrayList<>();
            userInfo.add(addressDTO.getName());
            userInfo.add(addressDTO.getEmail());
            addressRepository.save(addressEntity);
            return userInfo;
        } catch (Exception e) {
            throw new IllegalArgumentException("수거 주소 저장에 실패했습니다.");
        }
    }

    private static AddressEntity getAddressEntity(AddressDTO addressDTO, PickupListEntity pickupList) {
        AddressEntity addressEntity = new AddressEntity();
        addressEntity.setPickupList(pickupList);
        addressEntity.setName(addressDTO.getName());
        addressEntity.setEmail(addressDTO.getEmail());
        addressEntity.setPhone(addressDTO.getPhone());
        addressEntity.setPostalCode(addressDTO.getPostalCode());
        addressEntity.setRoadNameAddress(addressDTO.getRoadNameAddress());
        addressEntity.setDetailedAddress(addressDTO.getDetailedAddress());
        return addressEntity;
    }

    private void addDetails(List<DetailsDTO> details, PickupListEntity pickupList) {
        for(DetailsDTO detailsDTO : details) {
            DetailsEntity detailsEntity = new DetailsEntity();
            detailsEntity.setPickupList(pickupList);
            detailsEntity.setWasteId(detailsDTO.getWasteId());
            detailsEntity.setWeight(detailsDTO.getWeight());
            detailsEntity.setPricePreview(detailsDTO.getPricePreview());
            try{
                detailsRepository.save(detailsEntity);
            } catch (Exception e) {
                List<DetailsEntity> list = detailsRepository.findAllByPickupList(pickupList);
                detailsRepository.deleteAll(list);
                throw new IllegalStateException("디테일 저장 실패", e);
            }
        }
    }

    @Override
    public List<MyPickupDTO> findUserPickupList(String email){
        if(!addressRepository.existsByEmail(email))
            throw new RuntimeException("잘못된 이메일");
        List<MyPickupDTO> myPickupDTOList = new ArrayList<>();
        try {
            List<AddressEntity> myPickupAddress = addressRepository.findByEmail(email);
            addMyPickupDTOList(myPickupDTOList, myPickupAddress);
        } catch (Exception e) {
            throw new IllegalStateException("수거 정보 로드에 실패했습니다.");
        }
        return myPickupDTOList;
    }

    @Override
    public List<MyPickupDTO> findAllPickupList(){
        List<MyPickupDTO> myPickupDTOList = new ArrayList<>();
        try{
            List<AddressEntity> myPickupAddress = addressRepository.findAll();
            addMyPickupDTOList(myPickupDTOList, myPickupAddress);
        } catch (Exception e) {
            throw new IllegalStateException("전체 수거 리스트 로드에 실패했습니다.");
        }
        return myPickupDTOList;
    }

    private void addMyPickupDTOList(List<MyPickupDTO> myPickupDTOList, List<AddressEntity> myPickupAddress) {
        for (AddressEntity addressEntity : myPickupAddress) {
            MyPickupDTO myPickupDTO = MyPickupDTO.builder()
                    .pickupId(addressEntity.getPickupList().getPickupId())
                    .requestDate(addressEntity.getPickupList().getRequestDate())
                    .payment(addressEntity.getPickupList().getPayment())
                    .pickupProgress(addressEntity.getPickupList().getPickupProgress())
                    .pricePreview(addressEntity.getPickupList().getPricePreview())
                    .price(addressEntity.getPickupList().getPrice())
                    .accepted(addressEntity.getPickupList().getAccepted())
                    .build();
            myPickupDTOList.add(myPickupDTO);
        }
    }

    @Override
    public PickupDetailsDTO findPickupDetails(Long pickupId) {
        if (!pickupListRepository.existsByPickupId(pickupId))
            throw new RuntimeException("잘못된 수거 번호");

        PickupDetailsDTO pickupDetails = new PickupDetailsDTO();
        PickupListEntity pickupList;
        try {
            pickupList = pickupListRepository.findByPickupId(pickupId);
            AddressEntity addressEntity = addressRepository.findByPickupList(pickupList);
            pickupDetails.setName(addressEntity.getName());
            pickupDetails.setPhone(addressEntity.getPhone());
            pickupDetails.setEmail(addressEntity.getEmail());
            pickupDetails.setPostalCode(addressEntity.getPostalCode());
            pickupDetails.setRoadNameAddress(addressEntity.getRoadNameAddress());
            pickupDetails.setDetailedAddress(addressEntity.getDetailedAddress());
            pickupDetails.setPricePreview(pickupList.getPricePreview());
            pickupDetails.setPrice(pickupList.getPrice());
            pickupDetails.setPayment(pickupList.getPayment());
            pickupDetails.setAccepted(pickupList.getAccepted());
            pickupDetails.setPickupProgress(pickupList.getPickupProgress());
        } catch (Exception e) {
            throw new RuntimeException("주소 정보 로드 실패");
        } try{
            return addUserDetails(pickupList, pickupDetails);
        } catch (Exception e){
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void updatePickup(UpdatePickupDTO pickupDTO) {
        if(!pickupListRepository.existsByPickupId(pickupDTO.getPickupId()))
            throw new IllegalStateException("잘못된 수거 번호");
        PickupListEntity pickupList = pickupListRepository.findByPickupId(pickupDTO.getPickupId());
        try {
            pickupList.setPrice(pickupDTO.getPrice());
            pickupList.setPayment(pickupDTO.getPayment());
            pickupList.setPickupProgress(pickupDTO.getPickupProgress());
            pickupList.setAccepted(pickupDTO.getAccepted());
        } catch (Exception e) {
            throw new RuntimeException("수거 정보 업데이트 실패");
        } try {
            List<DetailsEntity> detailsEntities = detailsRepository.findAllByPickupList(pickupList);
            List<UpdateDetailsDTO> updateDetailsDTOList = pickupDTO.getDetails();
            for (DetailsEntity detailsEntity : detailsEntities) {
                for(UpdateDetailsDTO updateDetailsDTO : updateDetailsDTOList) {
                    if(detailsEntity.getWasteId().equals(updateDetailsDTO.getWasteId())) {
                        detailsEntity.setPrice(updateDetailsDTO.getPrice());
                    }
                }
            }
            pickupListRepository.save(pickupList);
            detailsRepository.saveAll(detailsEntities);
        } catch (Exception e) {
            throw new RuntimeException("수거 상세정보 업데이트 실패");
        }
    }

    private PickupDetailsDTO addUserDetails(PickupListEntity pickupList, PickupDetailsDTO pickupDetailsDTO) {
        try {
            List<DetailsEntity> detailsEntities = detailsRepository.findAllByPickupList(pickupList);
            List<DetailsResponseDTO> detailsResponseDTOList = new ArrayList<>();
            for (DetailsEntity detailsEntity : detailsEntities) {
                DetailsResponseDTO response = new DetailsResponseDTO();
                String wasteId = detailsEntity.getWasteId();

                if (wasteId.startsWith("DS_")) {
                    // DS_로 시작하는 경우의 처리
                    System.out.println("DS_ 패턴 매칭");
                    response.setWasteId(wasteId);
                    response.setWasteName(findTypeById(wasteId, "DailySupplies"));
                    response.setWeight(detailsEntity.getWeight());
                    response.setPricePreview(detailsEntity.getPricePreview());
                    response.setPrice(detailsEntity.getPrice());
                } else if (wasteId.startsWith("HA_")) {
                    // HA_로 시작하는 경우의 처리
                    System.out.println("HA_ 패턴 매칭");
                    response.setWasteId(wasteId);
                    response.setWasteName(findTypeById(wasteId, "HouseholdAppliances"));
                    response.setWeight(detailsEntity.getWeight());
                    response.setPricePreview(detailsEntity.getPricePreview());
                    response.setPrice(detailsEntity.getPrice());
                } else if (wasteId.startsWith("HF_")) {
                    // HF_로 시작하는 경우의 처리
                    System.out.println("HF_ 패턴 매칭");
                    response.setWasteId(wasteId);
                    response.setWasteName(findTypeById(wasteId, "HouseholdFurniture"));
                    response.setWeight(detailsEntity.getWeight());
                    response.setPricePreview(detailsEntity.getPricePreview());
                    response.setPrice(detailsEntity.getPrice());
                } else if (wasteId.startsWith("OI_")) {
                    // OI_로 시작하는 경우의 처리
                    System.out.println("OI_ 패턴 매칭");
                    response.setWasteId(wasteId);
                    response.setWasteName(findTypeById(wasteId, "OtherItems"));
                    response.setWeight(detailsEntity.getWeight());
                    response.setPricePreview(detailsEntity.getPricePreview());
                    response.setPrice(detailsEntity.getPrice());
                } else if (wasteId.startsWith("PL") || wasteId.startsWith("GL") || wasteId.startsWith("CN")) {
                    // 나머지 재활용품
                    System.out.println("나머지 재활용품 패턴 매칭");
                    response.setWasteId(wasteId);
                    response.setWasteName(findTypeById(wasteId, "Recyclables"));
                    response.setWeight(detailsEntity.getWeight());
                    response.setPricePreview(detailsEntity.getPricePreview());
                    response.setPrice(detailsEntity.getPrice());
                } else {
                    // 패턴 매칭되지 않는 경우의 처리
                    throw new IllegalArgumentException("알 수 없는 패턴");
                }
                detailsResponseDTOList.add(response);
            }
            pickupDetailsDTO.setDetails(detailsResponseDTOList);
        } catch (Exception e) {
            throw new RuntimeException("세부 정보 로드 실패: " + e.getMessage());
        }

        return pickupDetailsDTO;
    }

    private String findTypeById(String wasteId, String fileName) {
        String filePath = "WastePrice/" + fileName + ".txt";
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource(filePath).getInputStream(), StandardCharsets.UTF_8))) {

            String line;

            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\\|");
                if (parts.length >= 2) { // id와 type만 필요하므로 최소 길이만 확인
                    String id = parts[0].trim();
                    String type = parts[1].trim();

                    if (id.equals(wasteId)) {
                        return type; // id가 일치할 때 type 반환
                    }
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("폐기물 데이터 로드에 실패했습니다.", e);
        }

        throw new IllegalStateException("잘못된 폐기물 데이터"); // id가 일치하는 항목이 없을 때 null 반환
    }

    @Override
    public void removePickup(Long pickupId) {
        if (!pickupListRepository.existsByPickupId(pickupId)) {
            throw new IllegalStateException("잘못된 수거 번호");
        }

        try {
            PickupListEntity pickupList = pickupListRepository.findByPickupId(pickupId);
            AddressEntity addressEntity = addressRepository.findByPickupList(pickupList);
            List<DetailsEntity> detailsEntities = detailsRepository.findAllByPickupList(pickupList);

            // 삭제 작업을 트랜잭션 내에서 수행
            detailsRepository.deleteAll(detailsEntities);
            addressRepository.delete(addressEntity);
            pickupListRepository.delete(pickupList);

        } catch (Exception e) {
            throw new IllegalStateException("수거 정보 삭제에 실패했습니다.", e);
        }
    }

    private final LinkedHashMap<Long, LocationDTO> locationMap = new LinkedHashMap<>();

    @Override
    public void changeLocation(LocationDTO locationDTO) {
        try{
            if(!locationMap.containsKey(locationDTO.getPickupId())) {
                locationMap.put(locationDTO.getPickupId(), locationDTO);
            } else {
                locationMap.replace(locationDTO.getPickupId(), locationDTO);
            }
        } catch (Exception e) {
            throw new IllegalStateException("위치 정보 업데이트에 실패했습니다.");
        }
    }

    @Override
    public LocationDTO getPickupLocation(Long pickupId) {
        try{
            return locationMap.get(pickupId);
        }catch (Exception e) {
            throw new IllegalStateException("위치 정보 검색에 실패하였습니다.");
        }
    }

    public static LocalDate convertStringToLocalDate(String dateStr, String format) {
        try {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern(format);
            return LocalDate.parse(dateStr, formatter);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid date format or value: " + dateStr, e);
        }
    }

    @Override
    public List<DeliverPickupDTO> getTodayList(String today){
        String format = "yyyy-MM-dd";
        try{
            LocalDate pickupDate = convertStringToLocalDate(today, format);
            List<PickupListEntity> pickupLists = pickupListRepository.findByPickupDateOnly(pickupDate);
            if(pickupLists.isEmpty()) {
                throw new IllegalStateException("당일 수거 리스트가 없음");
            }
            List<DeliverPickupDTO> deliverPickupDTOList = new ArrayList<>();
            for(PickupListEntity pickupList : pickupLists){
                DeliverPickupDTO deliverPickupDTO = new DeliverPickupDTO();
                deliverPickupDTO.setPickupId(pickupList.getPickupId());
                AddressEntity addressEntity = addressRepository.findByPickupList(pickupList);
                deliverPickupDTO.setAddress(AddressDTO.builder()
                                .name(addressEntity.getName())
                                .email(addressEntity.getEmail())
                                .phone(addressEntity.getPhone())
                                .postalCode(addressEntity.getPostalCode())
                                .roadNameAddress(addressEntity.getRoadNameAddress())
                                .detailedAddress(addressEntity.getDetailedAddress())
                                .build());
                deliverPickupDTOList.add(deliverPickupDTO);
            }
            return deliverPickupDTOList;
        } catch (Exception e) {
            throw new IllegalArgumentException("당일 수거 리스트 조회 실패");
        }
    }
}
