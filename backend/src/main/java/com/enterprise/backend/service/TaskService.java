package com.enterprise.backend.service;

import com.enterprise.backend.dto.TaskRequest;
import com.enterprise.backend.dto.TaskResponse;
import com.enterprise.backend.model.*;
import com.enterprise.backend.repository.ProjectRepository;
import com.enterprise.backend.repository.TaskRepository;
import com.enterprise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {
        private final TaskRepository taskRepository;
        private final ProjectRepository projectRepository;
        private final UserRepository userRepository;

        @Transactional
        public TaskResponse createTask(Long projectId, TaskRequest request, String creatorEmail) {
                Project project = projectRepository.findById(projectId)
                                .orElseThrow(() -> new RuntimeException("Project not found"));

                User assignee = null;
                String targetEmail = request.getAssigneeEmail();

                // Default to creator if no assignee specified
                if (targetEmail == null || targetEmail.isEmpty()) {
                        targetEmail = creatorEmail;
                }

                if (targetEmail != null) {
                        assignee = userRepository.findByEmail(targetEmail)
                                        .orElseThrow(() -> new UsernameNotFoundException("Assignee not found"));
                }

                Task parentTask = null;
                if (request.getParentTaskId() != null) {
                        parentTask = taskRepository.findById(request.getParentTaskId())
                                        .orElseThrow(() -> new RuntimeException("Parent task not found"));
                }

                Task task = Task.builder()
                                .title(request.getTitle())
                                .description(request.getDescription())
                                .project(project)
                                .priority(request.getPriority())
                                .dueDate(request.getDueDate())
                                .assignee(assignee)
                                .parentTask(parentTask)
                                .status(TaskStatus.TODO)
                                .build();

                return mapToResponse(taskRepository.save(task));
        }

        public Page<TaskResponse> getTasksByProject(Long projectId, Pageable pageable) {
                return taskRepository.findByProjectId(projectId, pageable)
                                .map(this::mapToResponse);
        }

        public Page<TaskResponse> getAssignedTasks(String userEmail, Pageable pageable) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                return taskRepository.findByAssigneeId(user.getId(), pageable)
                                .map(this::mapToResponse);
        }

        @Transactional
        public TaskResponse updateTaskStatus(Long taskId, TaskStatus status) {
                Task task = taskRepository.findById(taskId)
                                .orElseThrow(() -> new RuntimeException("Task not found"));
                task.setStatus(status);
                return mapToResponse(taskRepository.save(task));
        }

        private TaskResponse mapToResponse(Task task) {
                return TaskResponse.builder()
                                .id(task.getId())
                                .title(task.getTitle())
                                .description(task.getDescription())
                                .status(task.getStatus())
                                .priority(task.getPriority())
                                .dueDate(task.getDueDate())
                                .assigneeEmail(task.getAssignee() != null ? task.getAssignee().getEmail() : null)
                                .projectId(task.getProject().getId())
                                .parentTaskId(task.getParentTask() != null ? task.getParentTask().getId() : null)
                                .createdAt(task.getCreatedAt())
                                .updatedAt(task.getUpdatedAt())
                                .build();
        }
}
