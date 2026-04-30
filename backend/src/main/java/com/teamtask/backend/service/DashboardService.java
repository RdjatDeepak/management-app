package com.teamtask.backend.service;

import com.teamtask.backend.dto.DashboardDTO;
import com.teamtask.backend.model.*;
import com.teamtask.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    public DashboardDTO getDashboardStats(Long projectId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByEmail(email).orElseThrow();
        Project project = projectRepository.findById(projectId).orElseThrow();

        // Check if user is Admin or Member
        boolean isAdmin = project.getAdmin().getId().equals(currentUser.getId());

        List<Task> relevantTasks;
        if (isAdmin) {
            // Admin sees everything in the project
            relevantTasks = taskRepository.findByProjectId(projectId);
        } else {
            // Member sees only their tasks within this project
            relevantTasks = taskRepository.findByProjectId(projectId).stream()
                    .filter(t -> t.getAssignedTo().getId().equals(currentUser.getId()))
                    .collect(Collectors.toList());
        }

        // Calculate Stats
        Map<String, Long> statusMap = relevantTasks.stream()
                .collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));

        long overdue = relevantTasks.stream()
                .filter(t -> t.getDueDate().isBefore(java.time.LocalDate.now()) && t.getStatus() != Status.DONE)
                .count();

        DashboardDTO.DashboardDTOBuilder builder = DashboardDTO.builder()
                .totalTasks(relevantTasks.size())
                .tasksByStatus(statusMap)
                .overdueTasks(overdue);

        if (isAdmin) {
            Map<String, Long> userWorkload = relevantTasks.stream()
                    .collect(Collectors.groupingBy(t -> t.getAssignedTo().getName(), Collectors.counting()));
            builder.tasksPerUser(userWorkload);
        }

        return builder.build();
    }
}