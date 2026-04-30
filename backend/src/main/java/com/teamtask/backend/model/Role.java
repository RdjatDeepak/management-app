package com.teamtask.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;

public enum Role {
    ROLE_ADMIN,
    ROLE_MEMBER;
    @JsonCreator
    public static Role fromString(String value) {
        if (value == null) return null;
        // This logic allows both "ADMIN" and "ROLE_ADMIN" to work
        if (value.equalsIgnoreCase("ADMIN")) return ROLE_ADMIN;
        if (value.equalsIgnoreCase("MEMBER")) return ROLE_MEMBER;
        return Role.valueOf(value);
    }
}