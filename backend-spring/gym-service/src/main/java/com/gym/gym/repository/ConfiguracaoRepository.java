package com.gym.gym.repository;

import com.gym.gym.model.ConfiguracaoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ConfiguracaoRepository extends JpaRepository<ConfiguracaoEntity, UUID> {
}
