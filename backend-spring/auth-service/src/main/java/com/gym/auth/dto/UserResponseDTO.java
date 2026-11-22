package com.gym.auth.dto;

import com.gym.auth.model.UserEntity;
import com.gym.common.enums.Perfil;

import java.time.LocalDateTime;
import java.util.UUID;

public record UserResponseDTO(
    UUID id,
    String nome,
    String email,
    Perfil perfil,
    String role,
    String especialidade,
    String bio,
    String disponibilidade,
    String telefone,
    String fotoUrl,
    boolean activo,
    LocalDateTime dataCriacao
) {
    public static UserResponseDTO from(UserEntity u) {
        return new UserResponseDTO(
            u.getId(), u.getNome(), u.getEmail(), u.getPerfil(),
            u.getRole(), u.getEspecialidade(), u.getBio(),
            u.getDisponibilidade(), u.getTelefone(), u.getFotoUrl(),
            u.isActivo(), u.getDataCriacao()
        );
    }
}
