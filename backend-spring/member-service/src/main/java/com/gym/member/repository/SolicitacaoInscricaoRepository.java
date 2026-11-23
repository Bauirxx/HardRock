package com.gym.member.repository;

import com.gym.member.model.SolicitacaoInscricaoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface SolicitacaoInscricaoRepository extends JpaRepository<SolicitacaoInscricaoEntity, UUID> {
    Page<SolicitacaoInscricaoEntity> findByActivoTrue(Pageable pageable);
    Page<SolicitacaoInscricaoEntity> findByStatusAndActivoTrue(String status, Pageable pageable);
}
