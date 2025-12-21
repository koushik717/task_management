package com.enterprise.backend.controller;

import com.enterprise.backend.dto.TaskRequest;
import com.enterprise.backend.dto.TaskResponse;
import com.enterprise.backend.model.TaskStatus;
import com.enterprise.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping("/project/{projectId}")
    public ResponseEntity<TaskResponse> createTask(
            @PathVariable Long projectId,
            @jakarta.validation.Valid @RequestBody TaskRequest request,
            java.security.Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(projectId, request, principal.getName()));
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Page<TaskResponse>> getProjectTasks(
            @PathVariable Long projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        String sortField = sort[0];
        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortField));

        return ResponseEntity.ok(taskService.getTasksByProject(projectId, pageRequest));
    }

    @GetMapping("/assigned")
    public ResponseEntity<Page<TaskResponse>> getAssignedTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "dueDate,asc") String[] sort,
            java.security.Principal principal) {

        String sortField = sort[0];
        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc")
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(direction, sortField));

        return ResponseEntity.ok(taskService.getAssignedTasks(principal.getName(), pageRequest));
    }

    @PatchMapping("/{taskId}/status")
    public ResponseEntity<TaskResponse> updateStatus(
            @PathVariable Long taskId,
            @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateTaskStatus(taskId, status));
    }
}
