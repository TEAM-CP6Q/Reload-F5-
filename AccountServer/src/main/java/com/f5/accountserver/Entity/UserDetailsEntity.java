package com.f5.accountserver.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_detail")
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsEntity {
    @Id
    @Column(nullable = false, unique = true)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Long postalCode;

    @Column(nullable = false)
    private String roadNameAddress;

    @Column(nullable = false)
    private String detailedAddress;

    @Column(nullable = false)
    private String phoneNumber;
}
