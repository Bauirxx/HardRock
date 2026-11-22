package com.gym.gym.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.gym.dto.*;
import com.gym.gym.model.PagamentoEntity;
import com.gym.gym.repository.PagamentoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PagamentoService {

    private final PagamentoRepository repository;

    public PagamentoService(PagamentoRepository repository) {
        this.repository = repository;
    }

    public Page<PagamentoDTO> listar(String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return repository.findByStatusAndActivoTrue(status, pageable).map(PagamentoDTO::from);
        }
        return repository.findByActivoTrue(pageable).map(PagamentoDTO::from);
    }

    public PagamentoDTO buscarPorId(UUID id) {
        return PagamentoDTO.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento", id)));
    }

    @Transactional
    public PagamentoDTO criar(CreatePagamentoDTO dto) {
        PagamentoEntity p = new PagamentoEntity();
        p.setClienteId(dto.clienteId());
        p.setValor(dto.valor());
        p.setTipo(dto.tipo() != null ? dto.tipo() : "mensalidade");
        p.setMetodo(dto.metodo());
        p.setDescricao(dto.descricao());
        p.setStatus(normalizarStatus(dto.status()));
        p.setDataVencimento(dto.dataVencimento());
        p.setDataPagamento(dto.dataPagamento());
        if ("completed".equals(p.getStatus()) && p.getDataPagamento() == null) {
            p.setDataPagamento(LocalDateTime.now());
        }
        return PagamentoDTO.from(repository.save(p));
    }

    @Transactional
    public PagamentoDTO actualizar(UUID id, CreatePagamentoDTO dto) {
        PagamentoEntity p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento", id));
        if (dto.valor() != null) p.setValor(dto.valor());
        if (dto.tipo() != null) p.setTipo(dto.tipo());
        if (dto.metodo() != null) p.setMetodo(dto.metodo());
        if (dto.descricao() != null) p.setDescricao(dto.descricao());
        if (dto.status() != null) {
            p.setStatus(normalizarStatus(dto.status()));
            if ("completed".equals(p.getStatus()) && p.getDataPagamento() == null) {
                p.setDataPagamento(LocalDateTime.now());
            }
        }
        if (dto.dataPagamento() != null) p.setDataPagamento(dto.dataPagamento());
        if (dto.dataVencimento() != null) p.setDataVencimento(dto.dataVencimento());
        return PagamentoDTO.from(repository.save(p));
    }

    @Transactional
    public void remover(UUID id) {
        PagamentoEntity p = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pagamento", id));
        repository.delete(p);
    }

    private String normalizarStatus(String status) {
        return status != null ? status : "pending";
    }
}
