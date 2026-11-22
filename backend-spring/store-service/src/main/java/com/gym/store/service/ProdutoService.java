package com.gym.store.service;

import com.gym.common.enums.CategoriaProduto;
import com.gym.common.exception.ResourceNotFoundException;
import com.gym.store.dto.*;
import com.gym.store.model.ProdutoEntity;
import com.gym.store.repository.ProdutoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.UUID;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public Page<ProdutoDTO> listarCatalogo(CategoriaProduto categoria, Pageable pageable) {
        if (categoria != null) {
            return produtoRepository.findByCategoriaAndActivoTrueAndStockGreaterThan(categoria, 0, pageable)
                    .map(ProdutoDTO::from);
        }
        return produtoRepository.findByActivoTrueAndStockGreaterThan(0, pageable).map(ProdutoDTO::from);
    }

    public Page<ProdutoDTO> listarTodos(Pageable pageable) {
        return produtoRepository.findByActivoTrue(pageable).map(ProdutoDTO::from);
    }

    public ProdutoDTO buscarPorId(UUID id) {
        return ProdutoDTO.from(produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id)));
    }

    @Transactional
    public ProdutoDTO criar(CreateProdutoDTO dto) {
        ProdutoEntity p = new ProdutoEntity();
        aplicar(p, dto);
        return ProdutoDTO.from(produtoRepository.save(p));
    }

    @Transactional
    public ProdutoDTO actualizar(UUID id, CreateProdutoDTO dto) {
        ProdutoEntity p = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
        aplicar(p, dto);
        return ProdutoDTO.from(produtoRepository.save(p));
    }

    // Parcial-safe: só altera os campos que vêm preenchidos (permite PATCH parcial
    // sem apagar o resto e sem NPE no unboxing de booleans nulos).
    private void aplicar(ProdutoEntity p, CreateProdutoDTO dto) {
        if (dto.nome() != null) p.setNome(dto.nome());
        if (dto.descricao() != null) p.setDescricao(dto.descricao());
        if (dto.categoria() != null) p.setCategoria(dto.categoria());
        if (dto.tipo() != null) p.setTipo(dto.tipo());
        if (dto.preco() != null) p.setPreco(dto.preco());
        if (dto.precoPromocional() != null) p.setPrecoPromocional(dto.precoPromocional());
        // frontend envia stock_quantidade; aceitar ambos
        if (dto.stockQuantidade() != null) p.setStock(dto.stockQuantidade());
        else if (dto.stock() != null) p.setStock(dto.stock());
        if (dto.sku() != null) p.setSku(dto.sku());
        if (dto.isMachine() != null) p.setMachine(dto.isMachine());
        if (dto.sobConsulta() != null) p.setSobConsulta(dto.sobConsulta());
        if (dto.destaque() != null) p.setDestaque(dto.destaque());
        if (dto.youtubeUrl() != null) p.setYoutubeUrl(dto.youtubeUrl());
        // Coleção @ElementCollection: limpar e re-adicionar na MESMA instância
        if (dto.imagens() != null) {
            p.getImagens().clear();
            p.getImagens().addAll(dto.imagens());
        }
        // imagem principal: a explícita ou a primeira da lista
        if (dto.imagemUrl() != null && !dto.imagemUrl().isBlank()) {
            p.setImagemUrl(dto.imagemUrl());
        } else if (dto.imagens() != null && !dto.imagens().isEmpty()) {
            p.setImagemUrl(dto.imagens().get(0));
        }
    }

    @Transactional
    public void desactivar(UUID id) {
        ProdutoEntity p = produtoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto", id));
        p.setActivo(false);
        produtoRepository.save(p);
    }
}
