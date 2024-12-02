package com.f5.imageserver.DTO.Image;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ImageDTO {
    private String result;
    @Builder.Default
    private List<String> images = new ArrayList<>();
}
