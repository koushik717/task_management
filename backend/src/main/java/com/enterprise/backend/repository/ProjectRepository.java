package com.enterprise.backend.repository;

import com.enterprise.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Page<Project> findByOwnerId(Long userId, Pageable pageable);

    List<Project> findByOwnerId(Long userId);
}
