package com.f5.accountserver.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DesignerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;
    @Column(nullable = false)
    private String image;
    @Column(unique = true, nullable = false)
    private String name;
    @Column(nullable = false)
    private String email;
    @Column(nullable = false)
    private String phone;
    @Column(nullable = false)
    private String career;
    @Column(nullable = false)
    private String category;
    @Column(nullable = false)
    private String pr;
    @Column(nullable = false)
    private Boolean empStatus = (false);
}
