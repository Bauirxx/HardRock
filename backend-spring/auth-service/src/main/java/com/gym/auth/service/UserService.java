package com.gym.auth.service;

import com.gym.auth.dto.*;
import com.gym.auth.model.UserEntity;
import com.gym.auth.repository.UserRepository;
import com.gym.common.enums.Perfil;
import com.gym.common.exception.BusinessException;
import com.gym.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailEventPublisher emailEvents;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       EmailEventPublisher emailEvents) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailEvents = emailEvents;
    }

    public Page<UserResponseDTO> listarTodos(Pageable pageable) {
        return userRepository.findByActivoTrue(pageable).map(UserResponseDTO::from);
    }

    public Page<UserResponseDTO> listar(String role, Pageable pageable) {
        if (role != null && !role.isBlank()) {
            return userRepository.findByRoleAndActivoTrue(role, pageable).map(UserResponseDTO::from);
        }
        return userRepository.findByActivoTrue(pageable).map(UserResponseDTO::from);
    }

    private String roleFromPerfil(Perfil p) {
        return switch (p) {
            case SUPER_USER, DONO_DO_GINASIO -> "admin";
            default -> "internal_client";
        };
    }

    public UserResponseDTO buscarPorId(UUID id) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador", id));
        return UserResponseDTO.from(user);
    }

    @Transactional
    public UserResponseDTO criar(CreateUserDTO dto, Perfil perfilSolicitante) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Email já está registado", HttpStatus.CONFLICT);
        }

        Perfil novoPerfil = dto.perfil() != null ? dto.perfil() : Perfil.USUARIO_NORMAL;

        if (perfilSolicitante == Perfil.DONO_DO_GINASIO && novoPerfil != Perfil.USUARIO_NORMAL) {
            throw new BusinessException("Dono do ginásio só pode criar utilizadores normais", HttpStatus.FORBIDDEN);
        }

        UserEntity user = new UserEntity();
        user.setNome(dto.nome());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setPerfil(novoPerfil);
        user.setRole(dto.role() != null ? dto.role() : roleFromPerfil(novoPerfil));
        user.setEspecialidade(dto.especialidade());
        user.setBio(dto.bio());
        user.setDisponibilidade(dto.disponibilidade());
        user.setTelefone(dto.telefone());
        user.setFotoUrl(dto.fotoUrl());

        UserEntity guardado = userRepository.save(user);

        // Inscrição presencial: envia email com as credenciais (password em claro só aqui,
        // antes de ser hashada — é a password temporária definida pelo staff).
        if (Boolean.TRUE.equals(dto.enviarCredenciais()) && dto.email() != null) {
            try {
                emailEvents.credenciaisAcesso(guardado.getNome(), guardado.getEmail(), dto.password());
            } catch (Exception e) {
                // não falhar a criação por causa do email
            }
        }

        return UserResponseDTO.from(guardado);
    }

    @Transactional
    public UserResponseDTO actualizar(UUID id, UpdateUserDTO dto, Perfil perfilSolicitante) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador", id));

        if (dto.nome() != null) user.setNome(dto.nome());
        if (dto.email() != null) {
            if (!user.getEmail().equals(dto.email()) && userRepository.existsByEmail(dto.email())) {
                throw new BusinessException("Email já está registado", HttpStatus.CONFLICT);
            }
            user.setEmail(dto.email());
        }
        if (dto.password() != null) user.setPassword(passwordEncoder.encode(dto.password()));
        if (dto.perfil() != null) {
            if (perfilSolicitante == Perfil.DONO_DO_GINASIO &&
                (dto.perfil() == Perfil.SUPER_USER || user.getPerfil() == Perfil.SUPER_USER)) {
                throw new BusinessException("Sem permissão para gerir SUPER_USERs", HttpStatus.FORBIDDEN);
            }
            user.setPerfil(dto.perfil());
        }
        if (dto.activo() != null) user.setActivo(dto.activo());
        if (dto.status() != null) user.setActivo(!"inactive".equalsIgnoreCase(dto.status()));
        if (dto.role() != null) user.setRole(dto.role());
        if (dto.especialidade() != null) user.setEspecialidade(dto.especialidade());
        if (dto.bio() != null) user.setBio(dto.bio());
        if (dto.disponibilidade() != null) user.setDisponibilidade(dto.disponibilidade());
        if (dto.telefone() != null) user.setTelefone(dto.telefone());
        if (dto.fotoUrl() != null) user.setFotoUrl(dto.fotoUrl());

        return UserResponseDTO.from(userRepository.save(user));
    }

    @Transactional
    public void desactivar(UUID id, Perfil perfilSolicitante) {
        UserEntity user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Utilizador", id));

        if (perfilSolicitante == Perfil.DONO_DO_GINASIO && user.getPerfil() != Perfil.USUARIO_NORMAL) {
            throw new BusinessException("Sem permissão para desactivar este utilizador", HttpStatus.FORBIDDEN);
        }

        user.setActivo(false);
        userRepository.save(user);
    }
}
