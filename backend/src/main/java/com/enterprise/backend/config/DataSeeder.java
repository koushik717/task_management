package com.enterprise.backend.config;

import com.enterprise.backend.model.*;
import com.enterprise.backend.repository.ProjectRepository;
import com.enterprise.backend.repository.TaskRepository;
import com.enterprise.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Optional;

@Component
@Slf4j
@RequiredArgsConstructor
@Profile("!test") // Don't run in tests
public class DataSeeder implements CommandLineRunner {

        private final UserRepository userRepository;
        private final ProjectRepository projectRepository;
        private final TaskRepository taskRepository;
        private final PasswordEncoder passwordEncoder;

        @Override
        public void run(String... args) throws Exception {
                seedUser("admin_demo@taskflow.com", "Demo@1234", Role.ADMIN, "Admin User");
                seedUser("user_demo@taskflow.com", "Demo@1234", Role.USER, "Demo User");

                log.info("Demo data seeding check complete!");
        }

        private void seedUser(String email, String password, Role role, String name) {
                if (userRepository.findByEmail(email).isPresent()) {
                        log.info("User {} already exists. Skipping.", email);
                        return;
                }

                log.info("Seeding user: {}", email);
                User user = User.builder()
                                .name(name)
                                .email(email)
                                .password(passwordEncoder.encode(password))
                                .role(role)
                                .build();
                userRepository.save(user);

                // Create some default data for valid users
                createMarketingCampaign(user);
        }

        private void createMarketingCampaign(User user) {
                Project project = Project.builder()
                                .name("Q4 Marketing Campaign")
                                .description("End of year marketing push for enterprise clients.")
                                .owner(user)
                                .build();
                projectRepository.save(project);

                createTask(project, user, "Design Ad Creatives", "Create banner ads for LinkedIn and Twitter",
                                TaskStatus.DONE,
                                TaskPriority.HIGH);
                createTask(project, user, "Schedule Social Posts", "Set up Hootsuite schedule for November",
                                TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM);
                createTask(project, user, "Review Analytics", "Analyze Q3 performance data", TaskStatus.TODO,
                                TaskPriority.HIGH);
        }

        private void createProductRoadmap(User user) {
                Project project = Project.builder()
                                .name("Product Roadmap 2026")
                                .description("Strategic planning for next year's feature set.")
                                .owner(user)
                                .build();
                projectRepository.save(project);

                createTask(project, user, "User Research", "Interview 5 key enterprise customers", TaskStatus.DONE,
                                TaskPriority.HIGH);
                createTask(project, user, "Draft PRD", "Write Product Requirements Document for Feature X",
                                TaskStatus.IN_PROGRESS, TaskPriority.HIGH);
                createTask(project, user, "Tech Feasibility", "Consult with engineering leads", TaskStatus.TODO,
                                TaskPriority.MEDIUM);
        }

        private void createWebsiteRedesign(User user) {
                Project project = Project.builder()
                                .name("Website Redesign")
                                .description("Overhaul of the main corporate website with new branding.")
                                .owner(user)
                                .build();
                projectRepository.save(project);

                createTask(project, user, "Wireframes", "Low-fidelity mockups for homepage", TaskStatus.DONE,
                                TaskPriority.MEDIUM);
                createTask(project, user, "UI Polish", "High-fidelity designs with glassmorphism",
                                TaskStatus.IN_PROGRESS,
                                TaskPriority.HIGH);
                createTask(project, user, "Mobile Responsiveness", "Ensure layout works on iPhone/Pixel",
                                TaskStatus.TODO,
                                TaskPriority.HIGH);
        }

        private void createTask(Project project, User user, String title, String desc, TaskStatus status,
                        TaskPriority priority) {
                Task task = Task.builder()
                                .title(title)
                                .description(desc)
                                .status(status)
                                .priority(priority)
                                .project(project)
                                .assignee(user)
                                .dueDate(LocalDateTime.now().plusDays(7))
                                .build();
                taskRepository.save(task);
        }
}
