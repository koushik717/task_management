package com.enterprise.backend.repository;

import com.enterprise.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Page<Task> findByProjectId(Long projectId, Pageable pageable);

    List<Task> findByProjectId(Long projectId);

    Page<Task> findByAssigneeId(Long assigneeId, Pageable pageable);
}
