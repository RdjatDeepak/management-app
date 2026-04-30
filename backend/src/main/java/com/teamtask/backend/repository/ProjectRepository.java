package com.teamtask.backend.repository;

import com.teamtask.backend.model.Project;
import com.teamtask.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    // Find all projects created by a specific Admin
    List<Project> findByAdmin(User admin);
}