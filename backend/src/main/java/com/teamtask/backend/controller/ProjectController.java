package com.teamtask.backend.controller;

import com.teamtask.backend.dto.AddMemberRequest;
import com.teamtask.backend.dto.ProjectRequest;
import com.teamtask.backend.model.Project;
import com.teamtask.backend.model.ProjectMember;
import com.teamtask.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<Project> create(@RequestBody ProjectRequest request) {
        return ResponseEntity.ok(projectService.createProject(request));
    }

    @GetMapping
    public ResponseEntity<List<Project>> getAllMyProjects() {
        return ResponseEntity.ok(projectService.getMyProjects());
    }
@PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMember> addMember(
            @PathVariable Long projectId,
            @RequestBody AddMemberRequest request) {
        return ResponseEntity.ok(projectService.addMemberToProject(projectId, request));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getById(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectById(projectId));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<ProjectMember>> getMembers(@PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectMembers(projectId));
    }
}
