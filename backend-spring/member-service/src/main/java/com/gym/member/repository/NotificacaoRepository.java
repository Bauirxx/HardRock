package com.gym.member.repository;

import com.gym.member.model.NotificacaoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificacaoRepository extends JpaRepository<NotificacaoEntity, UUID> {
    Page<NotificacaoEntity> findByActivoTrue(Pageable pageable);
    Page<NotificacaoEntity> findByUserIdAndActivoTrue(UUID userId, Pageable pageable);
}
