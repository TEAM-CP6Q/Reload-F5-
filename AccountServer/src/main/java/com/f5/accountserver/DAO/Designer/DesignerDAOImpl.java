package com.f5.accountserver.DAO.Designer;

import com.f5.accountserver.DTO.DesignerDTO;
import com.f5.accountserver.Entity.DesignerEntity;
import com.f5.accountserver.Repository.DesignerRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
public class DesignerDAOImpl implements DesignerDAO {
    private final DesignerRepository designerRepository;

    public DesignerDAOImpl(DesignerRepository designerRepository) {
        this.designerRepository = designerRepository;
    }

    @Override
    public void saveDesigner(DesignerDTO designerDTO) {
        try {
            if (!designerRepository.existsDesignerByNameAndEmail(designerDTO.getName(), designerDTO.getEmail())) {
                designerRepository.save(DTOToEntity(designerDTO));
            } else {
                throw new IllegalStateException("이미 동일한 디자이너가 존재합니다.");
            }
        } catch (IllegalStateException e) {
            throw e;  // 중복 오류는 그대로 전달
        } catch (Exception e) {
            throw new RuntimeException("디자이너 저장 중 오류 발생: " + e.getMessage());
        }
    }

    public void removeDesigner(Long id) {
        try{
            if(designerRepository.existsDesignerById(id)) {
                DesignerEntity designer = designerRepository.findById(id).orElse(null);
                designerRepository.delete(Objects.requireNonNull(designer));
            } else {
                throw new IllegalStateException("해당 ID의 디자이너가 없음");
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("디자이너 삭제 중 오류 발생"+ e.getMessage());
        }
    }

    private DesignerDTO entityToDTO(DesignerEntity designerEntity) {
        DesignerDTO designerDTO = new DesignerDTO();
        designerDTO.setId(designerEntity.getId());
        designerDTO.setImage(designerEntity.getImage());
        designerDTO.setName(designerEntity.getName());
        designerDTO.setEmail(designerEntity.getEmail());
        designerDTO.setPhone(designerEntity.getPhone());
        designerDTO.setCareer(designerEntity.getCareer());
        designerDTO.setCategory(designerEntity.getCategory());
        designerDTO.setPr(designerEntity.getPr());
        designerDTO.setEmpStatus(designerEntity.getEmpStatus());
        return designerDTO;
    }

    private DesignerEntity DTOToEntity(DesignerDTO designerDTO) {
        DesignerEntity designerEntity = new DesignerEntity();
        designerEntity.setImage(designerDTO.getImage());
        designerEntity.setName(designerDTO.getName());
        designerEntity.setEmail(designerDTO.getEmail());
        designerEntity.setPhone(designerDTO.getPhone());
        designerEntity.setCareer(designerDTO.getCareer());
        designerEntity.setCategory(designerDTO.getCategory());
        designerEntity.setPr(designerDTO.getPr());
        designerEntity.setEmpStatus(designerDTO.getEmpStatus());
        return designerEntity;
    }

    @Override
    public DesignerDTO getDesigner(Long id) {
        try {
            DesignerEntity designer = designerRepository.findById(id).orElse(null);
            return entityToDTO(Objects.requireNonNull(designer));
        } catch (IllegalStateException e) {
            throw new IllegalArgumentException("디자이너 조회에 실패");
        }
    }

    @Override
    public List<DesignerDTO> getDesigners() {
        try {
            List<DesignerEntity> designerEntities = designerRepository.findAll();
            List<DesignerDTO> designerDTOList = new ArrayList<>();
            for (DesignerEntity designerEntity : designerEntities) {
                designerDTOList.add(entityToDTO(designerEntity));
            }
            return designerDTOList;
        } catch (IllegalStateException e) {
            throw new IllegalArgumentException("디자이너 전체 조회에 실패했습니다.");
        }
    }

    @Override
    public DesignerDTO update(DesignerDTO designerDTO) {
        try {
            // 기존 엔티티를 조회
            DesignerEntity existingEntity = designerRepository.findById(designerDTO.getId())
                    .orElseThrow(() -> new IllegalStateException("해당 ID의 디자이너를 찾을 수 없습니다."));

            // 기존 엔티티의 속성을 업데이트
            existingEntity.setImage(designerDTO.getImage());
            existingEntity.setName(designerDTO.getName());
            existingEntity.setEmail(designerDTO.getEmail());
            existingEntity.setPhone(designerDTO.getPhone());
            existingEntity.setCareer(designerDTO.getCareer());
            existingEntity.setCategory(designerDTO.getCategory());
            existingEntity.setPr(designerDTO.getPr());
            existingEntity.setEmpStatus(designerDTO.getEmpStatus());

            // 엔티티를 저장
            designerRepository.save(existingEntity);
            return entityToDTO(existingEntity);
        } catch (IllegalStateException e) {
            throw new IllegalStateException("디자이너 수정 실패", e);
        }
    }

}
