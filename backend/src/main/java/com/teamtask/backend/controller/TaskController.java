package com.teamtask.backend.controller;

import com.teamtask.backend.dto.TaskRequest;
import com.teamtask.backend.model.Status;
import com.teamtask.backend.model.Task;
import com.teamtask.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/project/{projectId}")
    public ResponseEntity<Task> create(@PathVariable Long projectId, @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.createTask(projectId, request));
    }

@GetMapping("/my-tasks")
    public ResponseEntity<List<Task>> getMyTasks() {
        return ResponseEntity.ok(taskService.getMyTasks());
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getByProject(@PathVariable Long projectId) {
        return ResponseEntity.ok(taskService.getTasksByProject(projectId));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<Task> updateStatus(@PathVariable Long taskId, @RequestParam Status status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }
}