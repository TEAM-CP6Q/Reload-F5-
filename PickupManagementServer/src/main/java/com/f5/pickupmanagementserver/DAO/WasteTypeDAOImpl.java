package com.f5.pickupmanagementserver.DAO;

import com.f5.pickupmanagementserver.DTO.WasteTypeDTO;
import org.springframework.stereotype.Repository;

import org.springframework.core.io.ClassPathResource;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Repository
public class WasteTypeDAOImpl implements WasteTypeDAO {
    public List<WasteTypeDTO> getWasteTypes(String fileName) {
        List<WasteTypeDTO> wasteTypes = new ArrayList<>();
        String filePath = "WastePrice/" + fileName + ".txt";

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource(filePath).getInputStream(), StandardCharsets.UTF_8))) {

            String line;
            while ((line = reader.readLine()) != null) {
                String[] parts = line.split("\\|");
                if (parts.length == 4) {
                    String id = parts[0].trim();
                    String type = parts[1].trim();
                    String description = parts[2].trim();
                    Long price = Long.parseLong(parts[3].trim());

                    WasteTypeDTO wasteTypeDTO = WasteTypeDTO.builder()
                            .id(id)
                            .type(type)
                            .description(description)
                            .price(price)
                            .build();

                    wasteTypes.add(wasteTypeDTO);
                }
            }
        } catch (IOException e) {
            throw new RuntimeException("폐기물 데이터 로드에 실패했습니다.", e);
        }

        return wasteTypes;
    }
}

