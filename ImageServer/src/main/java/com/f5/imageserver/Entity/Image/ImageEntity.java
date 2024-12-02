package com.f5.imageserver.Entity.Image;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "image")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ImageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "LONGBLOB")
    @Lob
    private byte[] image;
}
