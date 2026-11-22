package com.gym.payment.repository;

import com.gym.payment.model.TransacaoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TransacaoRepository extends JpaRepository<TransacaoEntity, UUID> {
    Optional<TransacaoEntity> findByReferencia(String referencia);
    Optional<TransacaoEntity> findByPaysuiteId(String paysuiteId);
    Page<TransacaoEntity> findByActivoTrue(Pageable pageable);
    Page<TransacaoEntity> findByClienteIdAndActivoTrue(UUID clienteId, Pageable pageable);
}
