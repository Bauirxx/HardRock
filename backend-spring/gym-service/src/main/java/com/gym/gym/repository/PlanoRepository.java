package com.gym.gym.repository;

import com.gym.common.enums.EstadoPlano;
import com.gym.gym.model.PlanoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Repository
public interface PlanoRepository extends JpaRepository<PlanoEntity, UUID> {

    Page<PlanoEntity> findByActivoTrue(Pageable pageable);

    List<PlanoEntity> findByClienteIdAndEstado(UUID clienteId, EstadoPlano estado);

    boolean existsByClienteIdAndServicoIdAndEstado(UUID clienteId, UUID servicoId, EstadoPlano estado);

    long countByPersonalTrainerIdAndEstado(UUID ptId, EstadoPlano estado);

    @Query("SELECT p FROM PlanoEntity p WHERE p.estado = 'ACTIVO' AND p.dataFim <= :data")
    List<PlanoEntity> findPlanosExpirando(LocalDate data);

    @Query("SELECT p FROM PlanoEntity p WHERE p.estado = 'ACTIVO' AND p.dataFim < :hoje")
    List<PlanoEntity> findPlanosExpirados(LocalDate hoje);

    List<PlanoEntity> findByClienteId(UUID clienteId);
}
