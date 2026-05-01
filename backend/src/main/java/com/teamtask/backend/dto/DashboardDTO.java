package com.teamtask.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class DashboardDTO {
    private long totalTasks;
    private Map<String, Long> tasksByStatus; // e.g., {"DONE": 5, "TODO": 2}
    private long overdueTasks;

    // For Admin: list of users with their tasks
    private List<UserTasksDTO> userTasks;
}
