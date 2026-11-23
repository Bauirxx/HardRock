package com.gym.store.repository;

import com.gym.common.enums.CategoriaProduto;
import com.gym.store.model.ProdutoEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface ProdutoRepository extends JpaRepository<ProdutoEntity, UUID> {
    Page<ProdutoEntity> findByActivoTrueAndStockGreaterThan(int minStock, Pageable pageable);
    Page<ProdutoEntity> findByActivoTrue(Pageable pageable);
    Page<ProdutoEntity> findByCategoriaAndActivoTrueAndStockGreaterThan(CategoriaProduto cat, int min, Pageable p);

    // Unicidade do nome entre produtos activos (evita duplicados)
    boolean existsByNomeIgnoreCaseAndActivoTrue(String nome);
}
