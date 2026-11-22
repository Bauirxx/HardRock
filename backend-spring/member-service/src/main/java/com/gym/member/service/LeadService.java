package com.gym.member.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.member.dto.*;
import com.gym.member.model.LeadEntity;
import com.gym.member.repository.LeadRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class LeadService {

    private final LeadRepository repository;

    public LeadService(LeadRepository repository) {
        this.repository = repository;
    }

    public Page<LeadDTO> listar(String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return repository.findByStatusAndActivoTrue(status, pageable).map(LeadDTO::from);
        }
        return repository.findByActivoTrue(pageable).map(LeadDTO::from);
    }

    public LeadDTO buscarPorId(UUID id) {
        return LeadDTO.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id)));
    }

    @Transactional
    public LeadDTO criar(CreateLeadDTO dto) {
        LeadEntity l = new LeadEntity();
        l.setNome(dto.nome());
        l.setTelefone(dto.telefone());
        l.setEmail(dto.email());
        l.setInteresse(dto.interesse());
        l.setMensagem(dto.mensagem());
        l.setFonte(dto.fonte() != null ? dto.fonte() : "landing_page");
        l.setStatus(dto.status() != null ? dto.status() : "novo");
        return LeadDTO.from(repository.save(l));
    }

    @Transactional
    public LeadDTO actualizar(UUID id, CreateLeadDTO dto) {
        LeadEntity l = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
        if (dto.nome() != null) l.setNome(dto.nome());
        if (dto.telefone() != null) l.setTelefone(dto.telefone());
        if (dto.email() != null) l.setEmail(dto.email());
        if (dto.interesse() != null) l.setInteresse(dto.interesse());
        if (dto.mensagem() != null) l.setMensagem(dto.mensagem());
        if (dto.status() != null) l.setStatus(dto.status());
        return LeadDTO.from(repository.save(l));
    }

    @Transactional
    public void remover(UUID id) {
        LeadEntity l = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lead", id));
        repository.delete(l);
    }
}
