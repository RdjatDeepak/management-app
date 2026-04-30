package com.teamtask.backend.dto;

import com.teamtask.backend.model.Priority;
import lombok.Data;
import java.time.LocalDate;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private LocalDate dueDate;
    private Priority priority;
    private Long assignedToUserId; // The ID of the member
}