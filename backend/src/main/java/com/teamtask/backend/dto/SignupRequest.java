package com.teamtask.backend.dto;

import com.teamtask.backend.model.Role;
import lombok.Data;

@Data
public class SignupRequest {
    private String name;
    private String email;
    private String password;
    private Role role; // ADMIN or MEMBER
}