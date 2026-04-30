package com.teamtask.backend.config;

import com.teamtask.backend.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import lombok.RequiredArgsConstructor;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtFilter jwtFilter;
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())

                .authorizeHttpRequests(auth -> auth
                        // 1. PUBLIC: Anyone can signup or login
                        .requestMatchers("/api/auth/**").permitAll()

                        // 2. ADMIN ONLY: Creating projects and adding members
                        .requestMatchers(HttpMethod.POST, "/api/projects/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/tasks/project/**").hasRole("ADMIN")

                        // 3. SHARED/MEMBER: Viewing tasks, updating status, and getting dashboard
                        .requestMatchers("/api/tasks/my-tasks").authenticated()
                        .requestMatchers(HttpMethod.PATCH, "/api/tasks/*/status").authenticated()
                        .requestMatchers("/api/projects").authenticated()
                        .requestMatchers("/api/dashboard/**").authenticated()

                        // 4. CATCH-ALL: Everything else must be authenticated
                        .anyRequest().authenticated()
                )

                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}