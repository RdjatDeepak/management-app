package com.teamtask.backend.service;

import com.teamtask.backend.dto.TaskRequest;
import com.teamtask.backend.model.*;
import com.teamtask.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Transactional
    public Task createTask(Long projectId, TaskRequest request) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        // 1. Hard Security: Only the project Admin can create tasks
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        if (!project.getAdmin().getEmail().equals(email)) {
            throw new RuntimeException("Access Denied: Only Project Admins can create tasks");
        }

        // 2. Find the user to assign the task to
        User assignedUser = userRepository.findById(request.getAssignedToUserId())
                .orElseThrow(() -> new RuntimeException("Assigned user not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setDueDate(request.getDueDate());
        task.setPriority(request.getPriority());
        task.setStatus(Status.TODO);
        task.setProject(project);
        task.setAssignedTo(assignedUser);

        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTaskStatus(Long taskId, Status status) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        // 3. Logic Check: Only the Admin of the project OR the Assigned User can update status
        boolean isAdmin = task.getProject().getAdmin().getEmail().equals(email);
        boolean isAssigned = task.getAssignedTo().getEmail().equals(email);

        if (!isAdmin && !isAssigned) {
            throw new RuntimeException("You are not authorized to update this task's status");
        }

        task.setStatus(status);
        return taskRepository.save(task);
    }

    public List<Task> getMyTasks() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

// Use the ID since your repo has findByAssignedToId
        return taskRepository.findByAssignedToId(user.getId());
    }

    public List<Task> getTasksByProject(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }
}
