package com.teamtask.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class UserTasksDTO {
    private String userName;
    private String userEmail;
    private List<TaskDetailDTO> tasks;
    private long totalTasks;
    private long completedTasks;
    private long inProgressTasks;
    private long todoTasks;
}
