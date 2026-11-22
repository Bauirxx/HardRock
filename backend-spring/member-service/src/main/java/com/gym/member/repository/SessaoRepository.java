package com.gym.member.repository;

import com.gym.member.model.SessaoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SessaoRepository extends JpaRepository<SessaoEntity, UUID> {
    Page<SessaoEntity> findByActivoTrue(Pageable pageable);
    Page<SessaoEntity> findByTrainerIdAndActivoTrue(UUID trainerId, Pageable pageable);
    Page<SessaoEntity> findByClienteIdAndActivoTrue(UUID clienteId, Pageable pageable);
}
