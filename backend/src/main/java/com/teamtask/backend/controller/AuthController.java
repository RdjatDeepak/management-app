package com.teamtask.backend.controller;

import com.teamtask.backend.dto.AuthRequest;
import com.teamtask.backend.dto.SignupRequest;
import com.teamtask.backend.model.User;
import com.teamtask.backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    // this is for register new user
    @PostMapping("/signup")
    public ResponseEntity<User> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.registerUser(request));
    }
    // this is for log in
    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody AuthRequest request) {
        String token = authService.loginUser(request);
        // Returning as a Map so the frontend gets a JSON object: {"token": "..."}
        return ResponseEntity.ok(Map.of("token", token));
    }
}