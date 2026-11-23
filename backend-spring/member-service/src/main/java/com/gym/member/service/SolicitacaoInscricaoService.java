package com.gym.member.service;

import com.gym.common.exception.BusinessException;
import com.gym.common.exception.ResourceNotFoundException;
import com.gym.member.dto.*;
import com.gym.member.model.SolicitacaoInscricaoEntity;
import com.gym.member.repository.SolicitacaoInscricaoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;
import java.util.UUID;

@Service
public class SolicitacaoInscricaoService {

    private static final Set<String> ESTADOS = Set.of("pendente", "aprovado", "rejeitado");

    private final SolicitacaoInscricaoRepository repository;

    public SolicitacaoInscricaoService(SolicitacaoInscricaoRepository repository) {
        this.repository = repository;
    }

    public Page<SolicitacaoDTO> listar(String status, Pageable pageable) {
        if (status != null && !status.isBlank()) {
            return repository.findByStatusAndActivoTrue(status, pageable).map(SolicitacaoDTO::from);
        }
        return repository.findByActivoTrue(pageable).map(SolicitacaoDTO::from);
    }

    public SolicitacaoDTO buscarPorId(UUID id) {
        return SolicitacaoDTO.from(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação", id)));
    }

    // Submissão pública — cria sempre como pendente, nunca activa um membro directamente
    @Transactional
    public SolicitacaoDTO criar(CreateSolicitacaoDTO dto) {
        SolicitacaoInscricaoEntity s = new SolicitacaoInscricaoEntity();
        s.setNome(dto.nome());
        s.setTelefone(dto.telefone());
        s.setEmail(dto.email());
        s.setPlanoPretendido(dto.planoPretendido());
        s.setMensagem(dto.mensagem());
        s.setStatus("pendente");
        return SolicitacaoDTO.from(repository.save(s));
    }

    // Mudança de estado por um funcionário (aprovar/rejeitar)
    @Transactional
    public SolicitacaoDTO actualizarEstado(UUID id, String novoStatus, String revistoPor) {
        if (novoStatus == null || !ESTADOS.contains(novoStatus)) {
            throw new BusinessException("Estado inválido. Use: pendente, aprovado ou rejeitado.", HttpStatus.BAD_REQUEST);
        }
        SolicitacaoInscricaoEntity s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação", id));
        s.setStatus(novoStatus);
        if (revistoPor != null) s.setRevistoPor(revistoPor);
        return SolicitacaoDTO.from(repository.save(s));
    }

    @Transactional
    public void remover(UUID id) {
        SolicitacaoInscricaoEntity s = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Solicitação", id));
        s.setActivo(false);
        repository.save(s);
    }
}
