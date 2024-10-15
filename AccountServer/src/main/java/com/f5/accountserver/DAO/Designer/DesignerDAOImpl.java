package com.f5.accountserver.DAO.Designer;

import com.f5.accountserver.DTO.DesignerDTO;
import com.f5.accountserver.Entity.DesignerEntity;
import com.f5.accountserver.Repository.DesignerRepository;
import org.springframework.stereotype.Component;

@Component
public class DesignerDAOImpl implements DesignerDAO {
    private final DesignerRepository designerRepository;

    public DesignerDAOImpl(DesignerRepository designerRepository) {
        this.designerRepository = designerRepository;
    }

    @Override
    public void saveDesigner(DesignerDTO designerDTO) {
        try {
            if (!designerRepository.existsDesignerByName(designerDTO.getName())) {
                DesignerEntity designerEntity = DesignerEntity.builder()
                        .name(designerDTO.getName())
                        .image(designerDTO.getImage())
                        .build();
                designerRepository.save(designerEntity);
            } else {
                throw new IllegalStateException("이미 동일한 디자이너가 존재합니다.");
            }
        } catch (IllegalStateException e) {
            throw e;  // 중복 오류는 그대로 전달
        } catch (Exception e) {
            throw new RuntimeException("디자이너 저장 중 오류 발생: " + e.getMessage(), e);
        }
    }

    public void removeDesigner(String designerName) {
        try{
            if(designerRepository.existsDesignerByName(designerName)) {
                DesignerEntity designer = designerRepository.findByName(designerName);
                designerRepository.delete(designer);
            } else {
                throw new IllegalStateException("해당 이름의 디자이너가 없음");
            }
        } catch (IllegalStateException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("디자이너 삭제 중 오류 발생"+ e.getMessage(), e);
        }
    }

}
