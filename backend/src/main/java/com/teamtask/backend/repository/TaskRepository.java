package com.teamtask.backend.repository;

import com.teamtask.backend.model.Status;
import com.teamtask.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    // For Members: See tasks assigned to them
    List<Task> findByAssignedToId(Long userId);

    // For Admins: See all tasks in their project
    List<Task> findByProjectId(Long projectId);

    // For Dashboard: Count by status
    long countByAssignedToIdAndStatus(Long userId, Status status);

    // For Dashboard: Find Overdue tasks
    @Query("SELECT t FROM Task t WHERE t.assignedTo.id = :userId AND t.dueDate < CURRENT_DATE AND t.status != 'DONE'")
    List<Task> findOverdueTasks(Long userId);
}