package com.teamtask.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Map;

@Data
@Builder
public class DashboardDTO {
    private long totalTasks;
    private Map<String, Long> tasksByStatus; // e.g., {"DONE": 5, "TODO": 2}
    private long overdueTasks;

    // For Admin only: breakdown per user
    private Map<String, Long> tasksPerUser;
}