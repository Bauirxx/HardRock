package com.gym.member.service;

import com.gym.common.exception.BusinessException;
import com.gym.common.exception.ResourceNotFoundException;
import com.gym.member.dto.*;
import com.gym.member.model.PersonalTrainerEntity;
import com.gym.member.repository.ClienteRepository;
import com.gym.member.repository.PersonalTrainerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PersonalTrainerService {

    private final PersonalTrainerRepository ptRepository;
    private final ClienteRepository clienteRepository;

    public PersonalTrainerService(PersonalTrainerRepository ptRepository, ClienteRepository clienteRepository) {
        this.ptRepository = ptRepository;
        this.clienteRepository = clienteRepository;
    }

    public Page<PersonalTrainerDTO> listarTodos(Pageable pageable) {
        return ptRepository.findByActivoTrue(pageable).map(pt -> {
            long count = clienteRepository.countByPersonalTrainerIdAndActivoTrue(pt.getId());
            return PersonalTrainerDTO.from(pt, count);
        });
    }

    public PersonalTrainerDTO buscarPorId(UUID id) {
        PersonalTrainerEntity pt = ptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal Trainer", id));
        long count = clienteRepository.countByPersonalTrainerIdAndActivoTrue(pt.getId());
        return PersonalTrainerDTO.from(pt, count);
    }

    // Perfil de PT da conta de utilizador autenticada (ou null se não for trainer)
    public PersonalTrainerDTO buscarPorUtilizador(UUID utilizadorId) {
        return ptRepository.findByUtilizadorId(utilizadorId)
                .map(pt -> PersonalTrainerDTO.from(pt, clienteRepository.countByPersonalTrainerIdAndActivoTrue(pt.getId())))
                .orElse(null);
    }

    @Transactional
    public PersonalTrainerDTO criar(CreatePersonalTrainerDTO dto) {
        if (ptRepository.findByUtilizadorId(dto.utilizadorId()).isPresent()) {
            throw new BusinessException("Este utilizador já tem perfil de Personal Trainer", HttpStatus.CONFLICT);
        }

        PersonalTrainerEntity pt = new PersonalTrainerEntity();
        pt.setUtilizadorId(dto.utilizadorId());
        pt.setNome(dto.nome());
        if (dto.especialidades() != null) pt.setEspecialidades(dto.especialidades());
        if (dto.certificacoes() != null) pt.setCertificacoes(dto.certificacoes());
        pt.setBio(dto.bio());
        pt.setFoto(dto.foto());
        pt.setTelefone(dto.telefone());

        pt = ptRepository.save(pt);
        return PersonalTrainerDTO.from(pt, 0);
    }

    @Transactional
    public PersonalTrainerDTO actualizar(UUID id, UpdatePersonalTrainerDTO dto) {
        PersonalTrainerEntity pt = ptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal Trainer", id));

        if (dto.nome() != null) pt.setNome(dto.nome());
        if (dto.especialidades() != null) pt.setEspecialidades(dto.especialidades());
        if (dto.certificacoes() != null) pt.setCertificacoes(dto.certificacoes());
        if (dto.bio() != null) pt.setBio(dto.bio());
        if (dto.foto() != null) pt.setFoto(dto.foto());
        if (dto.telefone() != null) pt.setTelefone(dto.telefone());
        if (dto.activo() != null) pt.setActivo(dto.activo());

        pt = ptRepository.save(pt);
        long count = clienteRepository.countByPersonalTrainerIdAndActivoTrue(pt.getId());
        return PersonalTrainerDTO.from(pt, count);
    }

    @Transactional
    public void desactivar(UUID id) {
        PersonalTrainerEntity pt = ptRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Personal Trainer", id));
        pt.setActivo(false);
        ptRepository.save(pt);
    }
}
