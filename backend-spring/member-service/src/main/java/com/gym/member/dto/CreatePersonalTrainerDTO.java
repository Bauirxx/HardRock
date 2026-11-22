package com.gym.member.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;
import java.util.UUID;

public record CreatePersonalTrainerDTO(
    @NotNull(message = "ID do utilizador é obrigatório")
    UUID utilizadorId,

    @NotBlank(message = "Nome é obrigatório")
    String nome,

    List<String> especialidades,
    List<String> certificacoes,
    String bio,
    String foto,
    String telefone
) {}
