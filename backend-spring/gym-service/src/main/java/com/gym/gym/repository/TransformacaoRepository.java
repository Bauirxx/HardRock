package com.gym.gym.repository;

import com.gym.gym.model.TransformacaoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TransformacaoRepository extends JpaRepository<TransformacaoEntity, UUID> {
    Page<TransformacaoEntity> findByActivoTrueOrderByOrdemAsc(Pageable pageable);
}
