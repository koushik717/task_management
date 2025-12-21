package com.enterprise.backend.service;

import com.enterprise.backend.dto.ProjectRequest;
import com.enterprise.backend.dto.ProjectResponse;
import com.enterprise.backend.model.Project;
import com.enterprise.backend.model.User;
import com.enterprise.backend.repository.ProjectRepository;
import com.enterprise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProjectService {
        private final ProjectRepository projectRepository;
        private final UserRepository userRepository;

        @Transactional
        public ProjectResponse createProject(ProjectRequest request, String userEmail) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                Project project = Project.builder()
                                .name(request.getName())
                                .description(request.getDescription())
                                .owner(user)
                                .build();

                Project savedProject = projectRepository.save(project);
                if (savedProject == null) {
                        throw new RuntimeException("Failed to save project");
                }
                return mapToResponse(savedProject);
        }

        public Page<ProjectResponse> getUserProjects(String userEmail, Pageable pageable) {
                User user = userRepository.findByEmail(userEmail)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                return projectRepository.findByOwnerId(user.getId(), pageable)
                                .map(this::mapToResponse);
        }

        private ProjectResponse mapToResponse(Project project) {
                return ProjectResponse.builder()
                                .id(project.getId())
                                .name(project.getName())
                                .description(project.getDescription())
                                .ownerEmail(project.getOwner().getEmail())
                                .createdAt(project.getCreatedAt())
                                .updatedAt(project.getUpdatedAt())
                                .build();
        }
}
