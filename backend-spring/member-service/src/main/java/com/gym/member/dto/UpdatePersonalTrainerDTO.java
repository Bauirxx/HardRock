package com.gym.member.dto;

import java.util.List;

public record UpdatePersonalTrainerDTO(
    String nome,
    List<String> especialidades,
    List<String> certificacoes,
    String bio,
    String foto,
    String telefone,
    Boolean activo
) {}
