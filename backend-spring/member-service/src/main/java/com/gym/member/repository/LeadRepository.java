package com.gym.member.repository;

import com.gym.member.model.LeadEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface LeadRepository extends JpaRepository<LeadEntity, UUID> {
    Page<LeadEntity> findByActivoTrue(Pageable pageable);
    Page<LeadEntity> findByStatusAndActivoTrue(String status, Pageable pageable);
}
