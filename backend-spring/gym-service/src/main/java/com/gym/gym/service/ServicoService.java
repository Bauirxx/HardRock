package com.gym.gym.service;

import com.gym.common.exception.ResourceNotFoundException;
import com.gym.gym.dto.*;
import com.gym.gym.model.ServicoEntity;
import com.gym.gym.repository.ServicoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ServicoService {

    private final ServicoRepository servicoRepository;

    public ServicoService(ServicoRepository servicoRepository) {
        this.servicoRepository = servicoRepository;
    }

    public Page<ServicoDTO> listarActivos(Pageable pageable) {
        return servicoRepository.findByActivoTrue(pageable).map(ServicoDTO::from);
    }

    public ServicoDTO buscarPorId(UUID id) {
        ServicoEntity s = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço", id));
        return ServicoDTO.from(s);
    }

    @Transactional
    public ServicoDTO criar(CreateServicoDTO dto) {
        ServicoEntity s = new ServicoEntity();
        aplicar(s, dto);
        return ServicoDTO.from(servicoRepository.save(s));
    }

    @Transactional
    public ServicoDTO actualizar(UUID id, CreateServicoDTO dto) {
        ServicoEntity s = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço", id));
        aplicar(s, dto);
        return ServicoDTO.from(servicoRepository.save(s));
    }

    private void aplicar(ServicoEntity s, CreateServicoDTO dto) {
        s.setNome(dto.nome());
        s.setDescricao(dto.descricao());
        s.setPrecoMensal(dto.precoMensal());
        s.setPrecoTrimestral(dto.precoTrimestral());
        s.setPrecoAnual(dto.precoAnual());
        s.setDuracaoSessao(dto.duracaoSessao());
        s.setSessoesSemanais(dto.sessoesSemanais());
        s.setMaxAlunos(dto.maxAlunos());
        s.setIncluiPt(dto.incluiPt());
        s.setDestaque(dto.destaque());
        s.setCor(dto.cor());
        // Coleções @ElementCollection: limpar e re-adicionar na MESMA instância
        // (substituir a referência causa "collection no longer referenced" no update)
        if (dto.beneficios() != null) {
            s.getBeneficios().clear();
            s.getBeneficios().addAll(dto.beneficios());
        }
        if (dto.horarios() != null) {
            s.getHorarios().clear();
            s.getHorarios().addAll(dto.horarios());
        }
    }

    @Transactional
    public void desactivar(UUID id) {
        ServicoEntity s = servicoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço", id));
        s.setActivo(false);
        servicoRepository.save(s);
    }
}
