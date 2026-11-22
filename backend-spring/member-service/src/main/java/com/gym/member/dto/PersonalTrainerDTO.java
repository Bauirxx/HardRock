package com.gym.member.dto;

import com.gym.member.model.PersonalTrainerEntity;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record PersonalTrainerDTO(
    UUID id,
    UUID utilizadorId,
    String nome,
    List<String> especialidades,
    List<String> certificacoes,
    String bio,
    String foto,
    String telefone,
    boolean activo,
    LocalDateTime dataCriacao,
    long clientesActivos
) {
    public static PersonalTrainerDTO from(PersonalTrainerEntity pt, long clientesActivos) {
        return new PersonalTrainerDTO(
            pt.getId(), pt.getUtilizadorId(), pt.getNome(),
            pt.getEspecialidades(), pt.getCertificacoes(),
            pt.getBio(), pt.getFoto(), pt.getTelefone(),
            pt.isActivo(), pt.getDataCriacao(), clientesActivos
        );
    }
}
