package com.teamtask.backend.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import com.teamtask.backend.model.Status;
import com.teamtask.backend.model.Priority;

@Data
@Builder
public class TaskDetailDTO {
    private Long taskId;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private LocalDate dueDate;
    private String assignedToName;
    private String assignedToEmail;
}
