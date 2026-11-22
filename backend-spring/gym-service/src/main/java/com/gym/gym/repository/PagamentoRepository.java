package com.gym.gym.repository;

import com.gym.gym.model.PagamentoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PagamentoRepository extends JpaRepository<PagamentoEntity, UUID> {
    Page<PagamentoEntity> findByActivoTrue(Pageable pageable);
    Page<PagamentoEntity> findByStatusAndActivoTrue(String status, Pageable pageable);
}
