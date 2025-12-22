package com.enterprise.backend.service;

import com.enterprise.backend.dto.TaskRequest;
import com.enterprise.backend.dto.TaskResponse;
import com.enterprise.backend.model.Project;
import com.enterprise.backend.model.Task;
import com.enterprise.backend.model.TaskPriority;
import com.enterprise.backend.repository.ProjectRepository;
import com.enterprise.backend.repository.TaskRepository;
import com.enterprise.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class TaskServiceTest {

    @Mock
    private TaskRepository taskRepository;
    @Mock
    private ProjectRepository projectRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskService taskService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createTask_shouldSaveTask() {
        Project project = new Project();
        project.setId(1L);

        when(projectRepository.findById(1L)).thenReturn(Optional.of(project));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(new com.enterprise.backend.model.User()));
        when(taskRepository.save(any(Task.class))).thenAnswer(i -> {
            Task t = i.getArgument(0);
            t.setId(100L);
            return t;
        });

        TaskRequest request = new TaskRequest();
        request.setTitle("Test Task");
        request.setPriority(TaskPriority.HIGH);

        TaskResponse response = taskService.createTask(1L, request, "test@example.com");

        assertNotNull(response);
        assertEquals("Test Task", response.getTitle());
        assertEquals(1L, response.getProjectId());
        verify(taskRepository).save(any(Task.class));
    }
}
