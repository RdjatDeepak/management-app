package com.teamtask.backend.service;

import com.teamtask.backend.dto.AddMemberRequest;
import com.teamtask.backend.dto.ProjectRequest;
import com.teamtask.backend.model.Project;
import com.teamtask.backend.model.ProjectMember;
import com.teamtask.backend.model.Role;
import com.teamtask.backend.model.User;
import com.teamtask.backend.repository.ProjectMemberRepository;
import com.teamtask.backend.repository.ProjectRepository;
import com.teamtask.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public Project createProject(ProjectRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Project project = new Project();
        project.setName(request.getName());
        project.setDescription(request.getDescription());
        project.setAdmin(currentUser);

        return projectRepository.save(project);
    }

public List<Project> getMyProjects() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Get projects where user is admin
        List<Project> adminProjects = projectRepository.findByAdmin(currentUser);
        
        // Get projects where user is a member
        List<ProjectMember> memberships = projectMemberRepository.findByUserId(currentUser.getId());
        List<Project> memberProjects = memberships.stream()
                .map(pm -> pm.getProject())
                .toList();
        
        // Combine and remove duplicates
        adminProjects.addAll(memberProjects);
        return adminProjects;
    }

    @Transactional
    public ProjectMember addMemberToProject(Long projectId, AddMemberRequest request) {
        // 1. Identify the logged-in Admin
        String adminEmail = SecurityContextHolder.getContext().getAuthentication().getName();

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // 2. Security Check: Verify that the person making the request IS the admin of this project
        if (!project.getAdmin().getEmail().equals(adminEmail)) {
            throw new RuntimeException("Access Denied: Only the project Admin can add members");
        }

        // 3. Find or Auto-Create the User
        // If the email doesn't exist, we create a new account with ROLE_MEMBER
        User memberUser = userRepository.findByEmail(request.getEmail())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setName(request.getName());
                    newUser.setEmail(request.getEmail());
                    newUser.setRole(Role.ROLE_MEMBER);
                    // Use the password provided by the Admin in the request
                    newUser.setPassword(passwordEncoder.encode(request.getPassword()));
                    return userRepository.save(newUser);
                });

        // 4. Create the Project-User Relationship
        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(project);
        projectMember.setUser(memberUser);
        projectMember.setTeamRole(request.getTeamRole());

        // Setting default permissions from the DTO
        projectMember.setCanCreateTasks(request.isCanCreateTasks());
        projectMember.setCanUpdateStatus(request.isCanUpdateStatus());

return projectMemberRepository.save(projectMember);
    }

    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public List<ProjectMember> getProjectMembers(Long projectId) {
        return projectMemberRepository.findByProjectId(projectId);
    }
    public List<Project> findAll() {
        // This calls the built-in JpaRepository method
        return projectRepository.findAll();
    }
}
