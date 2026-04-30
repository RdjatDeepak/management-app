package com.teamtask.backend.controller;

import com.teamtask.backend.dto.DashboardDTO;
import com.teamtask.backend.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<DashboardDTO> getStats(@PathVariable Long projectId) {
        return ResponseEntity.ok(dashboardService.getDashboardStats(projectId));
    }
}