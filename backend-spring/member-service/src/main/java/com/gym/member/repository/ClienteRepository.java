package com.gym.member.repository;

import com.gym.common.enums.TipoCliente;
import com.gym.member.model.ClienteEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ClienteRepository extends JpaRepository<ClienteEntity, UUID> {

    Page<ClienteEntity> findByActivoTrue(Pageable pageable);

    Page<ClienteEntity> findByTipoClienteAndActivoTrue(TipoCliente tipo, Pageable pageable);

    List<ClienteEntity> findByPersonalTrainerIdAndActivoTrue(UUID personalTrainerId);

    Optional<ClienteEntity> findByBilheteIdentidade(String bi);

    Optional<ClienteEntity> findByUserId(UUID userId);

    boolean existsByBilheteIdentidade(String bi);

    long countByPersonalTrainerIdAndActivoTrue(UUID personalTrainerId);
}
