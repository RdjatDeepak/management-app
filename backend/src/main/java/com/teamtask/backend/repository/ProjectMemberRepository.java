package com.teamtask.backend.repository;

import com.teamtask.backend.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    List<ProjectMember> findByProjectId(Long projectId);
    List<ProjectMember> findByUserId(Long userId);
}