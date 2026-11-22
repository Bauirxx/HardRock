package com.gym.member.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.member.dto.*;
import com.gym.member.model.SessaoEntity;
import com.gym.member.repository.SessaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SessaoService {

    private final SessaoRepository repository;

    public SessaoService(SessaoRepository repository) {
        this.repository = repository;
    }

    public Page<SessaoDTO> listar(UUID trainerId, UUID clienteId, Pageable pageable) {
        if (trainerId != null) {
            return repository.findByTrainerIdAndActivoTrue(trainerId, pageable).map(SessaoDTO::from);
        }
        if (clienteId != null) {
            return repository.findByClienteIdAndActivoTrue(clienteId, pageable).map(SessaoDTO::from);
        }
        return repository.findByActivoTrue(pageable).map(SessaoDTO::from);
    }

    public SessaoDTO buscarPorId(UUID id) {
        return SessaoDTO.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sessão", id)));
    }

    @Transactional
    public SessaoDTO criar(CreateSessaoDTO dto) {
        SessaoEntity s = new SessaoEntity();
        aplicar(s, dto);
        if (s.getStatus() == null) s.setStatus("scheduled");
        return SessaoDTO.from(repository.save(s));
    }

    @Transactional
    public SessaoDTO actualizar(UUID id, CreateSessaoDTO dto) {
        SessaoEntity s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sessão", id));
        aplicar(s, dto);
        return SessaoDTO.from(repository.save(s));
    }

    @Transactional
    public void remover(UUID id) {
        SessaoEntity s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sessão", id));
        repository.delete(s);
    }

    private void aplicar(SessaoEntity s, CreateSessaoDTO dto) {
        if (dto.clienteId() != null) s.setClienteId(dto.clienteId());
        if (dto.trainerId() != null) s.setTrainerId(dto.trainerId());
        if (dto.data() != null) s.setData(dto.data());
        if (dto.horaInicio() != null) s.setHoraInicio(dto.horaInicio());
        if (dto.horaFim() != null) s.setHoraFim(dto.horaFim());
        if (dto.status() != null) s.setStatus(dto.status());
        if (dto.notas() != null) s.setNotas(dto.notas());
        if (dto.local() != null) s.setLocal(dto.local());
    }
}
