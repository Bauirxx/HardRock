package com.gym.gym.repository;

import com.gym.gym.model.ServicoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ServicoRepository extends JpaRepository<ServicoEntity, UUID> {

    Page<ServicoEntity> findByActivoTrue(Pageable pageable);
}
