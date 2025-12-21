package com.enterprise.backend.dto;

import com.enterprise.backend.model.TaskPriority;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    private String description;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private String assigneeEmail;
    private Long parentTaskId;
}
