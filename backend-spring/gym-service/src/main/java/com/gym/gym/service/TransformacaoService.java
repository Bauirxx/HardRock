package com.gym.gym.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.gym.dto.*;
import com.gym.gym.model.TransformacaoEntity;
import com.gym.gym.repository.TransformacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TransformacaoService {

    private final TransformacaoRepository repository;

    public TransformacaoService(TransformacaoRepository repository) {
        this.repository = repository;
    }

    public Page<TransformacaoDTO> listar(Pageable pageable) {
        return repository.findByActivoTrueOrderByOrdemAsc(pageable).map(TransformacaoDTO::from);
    }

    public TransformacaoDTO buscarPorId(UUID id) {
        return TransformacaoDTO.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transformação", id)));
    }

    @Transactional
    public TransformacaoDTO criar(CreateTransformacaoDTO dto) {
        TransformacaoEntity t = new TransformacaoEntity();
        t.setNome(dto.nome());
        t.setAntes(dto.antes());
        t.setDepois(dto.depois());
        t.setTempo(dto.tempo());
        t.setResultado(dto.resultado());
        t.setOrdem(dto.ordem() != null ? dto.ordem() : 0);
        return TransformacaoDTO.from(repository.save(t));
    }

    @Transactional
    public TransformacaoDTO actualizar(UUID id, CreateTransformacaoDTO dto) {
        TransformacaoEntity t = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transformação", id));
        if (dto.nome() != null) t.setNome(dto.nome());
        if (dto.antes() != null) t.setAntes(dto.antes());
        if (dto.depois() != null) t.setDepois(dto.depois());
        if (dto.tempo() != null) t.setTempo(dto.tempo());
        if (dto.resultado() != null) t.setResultado(dto.resultado());
        if (dto.ordem() != null) t.setOrdem(dto.ordem());
        return TransformacaoDTO.from(repository.save(t));
    }

    @Transactional
    public void remover(UUID id) {
        TransformacaoEntity t = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transformação", id));
        repository.delete(t);
    }
}
