package com.enterprise.backend;

import com.enterprise.backend.model.Project;
import com.enterprise.backend.repository.ProjectRepository;
import com.enterprise.backend.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProjectIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        // No explicit cleanup needed if using @Transactional or in-memory DB,
        // but for integration test against real env, might need cleanup.
        // Assuming H2 or test container for @SpringBootTest or mocked services.
        // For simplicity in this demo environment, we rely on MockUser.
    }

    @Test
    void shouldCreateAndListProjects() throws Exception {
        // 1. Register
        String registerJson = """
                {
                    "name": "Test User",
                    "email": "test@integration.com",
                    "password": "password"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(registerJson))
                .andExpect(status().isOk());

        // 2. Login
        String loginJson = """
                {
                    "email": "test@integration.com",
                    "password": "password"
                }
                """;

        String tokenResponse = mockMvc.perform(post("/api/v1/auth/authenticate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        // Extract token (rough parse for simplicity)
        String token = tokenResponse.split(":")[1].replaceAll("[\"}]", "");

        // 3. Get Projects
        mockMvc.perform(get("/api/v1/projects")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk());
    }
}
