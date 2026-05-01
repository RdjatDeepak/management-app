package com.teamtask.backend.service;

import com.teamtask.backend.dto.*;
import com.teamtask.backend.model.*;
import com.teamtask.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
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

        // Calculate Stats by Status
        Map<String, Long> statusMap = relevantTasks.stream()
                .collect(Collectors.groupingBy(t -> t.getStatus().name(), Collectors.counting()));

        long overdue = relevantTasks.stream()
                .filter(t -> t.getDueDate() != null && t.getDueDate().isBefore(java.time.LocalDate.now()) && t.getStatus() != Status.DONE)
                .count();

        DashboardDTO.DashboardDTOBuilder builder = DashboardDTO.builder()
                .totalTasks(relevantTasks.size())
                .tasksByStatus(statusMap)
                .overdueTasks(overdue);

        // Only add userTasks for Admin view
        if (isAdmin) {
            List<UserTasksDTO> userTasksList = buildUserTasksList(relevantTasks);
            builder.userTasks(userTasksList);
        }

        return builder.build();
    }

    private List<UserTasksDTO> buildUserTasksList(List<Task> tasks) {
        // Group tasks by user
        Map<String, List<Task>> tasksByUser = tasks.stream()
                .collect(Collectors.groupingBy(t -> t.getAssignedTo().getName()));

        List<UserTasksDTO> userTasksList = new ArrayList<>();

        for (Map.Entry<String, List<Task>> entry : tasksByUser.entrySet()) {
            String userName = entry.getKey();
            List<Task> userTaskList = entry.getValue();

            // Get user details from first task (they all belong to same user)
            User user = userTaskList.get(0).getAssignedTo();

            // Convert tasks to TaskDetailDTO
            List<TaskDetailDTO> taskDetails = userTaskList.stream()
                    .map(task -> TaskDetailDTO.builder()
                            .taskId(task.getId())
                            .title(task.getTitle())
                            .description(task.getDescription())
                            .status(task.getStatus())
                            .priority(task.getPriority())
                            .dueDate(task.getDueDate())
                            .assignedToName(task.getAssignedTo().getName())
                            .assignedToEmail(task.getAssignedTo().getEmail())
                            .build())
                    .collect(Collectors.toList());

            // Calculate counts
            long total = userTaskList.size();
            long completed = userTaskList.stream().filter(t -> t.getStatus() == Status.DONE).count();
            long inProgress = userTaskList.stream().filter(t -> t.getStatus() == Status.IN_PROGRESS).count();
            long todo = userTaskList.stream().filter(t -> t.getStatus() == Status.TODO).count();

            UserTasksDTO userTasks = UserTasksDTO.builder()
                    .userName(userName)
                    .userEmail(user.getEmail())
                    .tasks(taskDetails)
                    .totalTasks(total)
                    .completedTasks(completed)
                    .inProgressTasks(inProgress)
                    .todoTasks(todo)
                    .build();

            userTasksList.add(userTasks);
        }

        return userTasksList;
    }
}
