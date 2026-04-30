package com.teamtask.backend.dto;

import lombok.Data;

@Data
public class AddMemberRequest {
    private String email;
    private String password; // Admin sets initial password
    private String name;
    private String teamRole;
    private boolean canCreateTasks;
    private boolean canUpdateStatus;
}