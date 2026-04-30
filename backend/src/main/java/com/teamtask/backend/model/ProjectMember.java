package com.teamtask.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // Permissions flags (IAM Style)
    private boolean canUpdateStatus = true;
    private boolean canCreateTasks = false; // Usually only Admin
    // Role within the team (e.g., Developer, Designer)
    private String teamRole;
}