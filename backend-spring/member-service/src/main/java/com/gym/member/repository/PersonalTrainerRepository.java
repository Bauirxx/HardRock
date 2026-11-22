package com.gym.member.repository;

import com.gym.member.model.PersonalTrainerEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonalTrainerRepository extends JpaRepository<PersonalTrainerEntity, UUID> {

    Page<PersonalTrainerEntity> findByActivoTrue(Pageable pageable);

    Optional<PersonalTrainerEntity> findByUtilizadorIdAndActivoTrue(UUID utilizadorId);

    Optional<PersonalTrainerEntity> findByUtilizadorId(UUID utilizadorId);
}
