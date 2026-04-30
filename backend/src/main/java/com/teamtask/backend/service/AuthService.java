package com.teamtask.backend.service;

import com.teamtask.backend.dto.AuthRequest;
import com.teamtask.backend.dto.SignupRequest;
import com.teamtask.backend.model.User;
import com.teamtask.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.teamtask.backend.dto.AuthRequest; // Import this!
import com.teamtask.backend.security.JwtUtils;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public User registerUser(SignupRequest request) {
        if(userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists!");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        // Hash the password before saving!
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        return userRepository.save(user);
    }

    public String loginUser(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            // Change this line to pass the 'user' object, not just email
            return jwtUtils.generateToken(user);
        }
        throw new RuntimeException("Invalid credentials");
    }
}