package com.teamtask.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // 'user' is often a reserved word in PG SQL, so 'users' is safer
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;
}