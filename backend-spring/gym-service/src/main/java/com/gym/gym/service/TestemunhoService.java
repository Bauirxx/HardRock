package com.gym.gym.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.gym.dto.*;
import com.gym.gym.model.TestemunhoEntity;
import com.gym.gym.repository.TestemunhoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class TestemunhoService {

    private final TestemunhoRepository repository;

    public TestemunhoService(TestemunhoRepository repository) {
        this.repository = repository;
    }

    public Page<TestemunhoDTO> listar(String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return repository.findByStatusAndActivoTrue(status, pageable).map(TestemunhoDTO::from);
        }
        return repository.findByActivoTrue(pageable).map(TestemunhoDTO::from);
    }

    public TestemunhoDTO buscarPorId(UUID id) {
        return TestemunhoDTO.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testemunho", id)));
    }

    @Transactional
    public TestemunhoDTO criar(CreateTestemunhoDTO dto) {
        TestemunhoEntity t = new TestemunhoEntity();
        t.setNome(dto.nome());
        t.setTexto(dto.texto());
        t.setStars(dto.stars() != null ? dto.stars() : 5);
        t.setStatus(dto.status() != null ? dto.status() : "pending");
        t.setCargo(dto.cargo());
        t.setFoto(dto.foto());
        return TestemunhoDTO.from(repository.save(t));
    }

    @Transactional
    public TestemunhoDTO actualizar(UUID id, CreateTestemunhoDTO dto) {
        TestemunhoEntity t = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testemunho", id));
        if (dto.nome() != null) t.setNome(dto.nome());
        if (dto.texto() != null) t.setTexto(dto.texto());
        if (dto.stars() != null) t.setStars(dto.stars());
        if (dto.status() != null) t.setStatus(dto.status());
        if (dto.cargo() != null) t.setCargo(dto.cargo());
        if (dto.foto() != null) t.setFoto(dto.foto());
        return TestemunhoDTO.from(repository.save(t));
    }

    @Transactional
    public void remover(UUID id) {
        TestemunhoEntity t = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Testemunho", id));
        repository.delete(t);
    }
}
