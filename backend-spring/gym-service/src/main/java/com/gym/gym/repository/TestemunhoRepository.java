package com.gym.gym.repository;

import com.gym.gym.model.TestemunhoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TestemunhoRepository extends JpaRepository<TestemunhoEntity, UUID> {
    Page<TestemunhoEntity> findByActivoTrue(Pageable pageable);
    Page<TestemunhoEntity> findByStatusAndActivoTrue(String status, Pageable pageable);
}
