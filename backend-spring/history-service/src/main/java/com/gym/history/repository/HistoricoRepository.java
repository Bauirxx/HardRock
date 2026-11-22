package com.gym.history.repository;

import com.gym.history.model.HistoricoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface HistoricoRepository extends JpaRepository<HistoricoEntity, UUID> {
    Page<HistoricoEntity> findByClienteIdOrderByDataRegistroDesc(UUID clienteId, Pageable pageable);
}
