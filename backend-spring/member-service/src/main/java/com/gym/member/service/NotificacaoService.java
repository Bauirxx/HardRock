package com.gym.member.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.member.dto.*;
import com.gym.member.model.NotificacaoEntity;
import com.gym.member.repository.NotificacaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class NotificacaoService {

    private final NotificacaoRepository repository;

    public NotificacaoService(NotificacaoRepository repository) {
        this.repository = repository;
    }

    public Page<NotificacaoDTO> listar(UUID userId, Pageable pageable) {
        if (userId != null) {
            return repository.findByUserIdAndActivoTrue(userId, pageable).map(NotificacaoDTO::from);
        }
        return repository.findByActivoTrue(pageable).map(NotificacaoDTO::from);
    }

    @Transactional
    public NotificacaoDTO marcarLida(UUID id) {
        NotificacaoEntity n = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação", id));
        n.setLida(true);
        return NotificacaoDTO.from(repository.save(n));
    }

    @Transactional
    public void remover(UUID id) {
        NotificacaoEntity n = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação", id));
        repository.delete(n);
    }
}
