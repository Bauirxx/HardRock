package com.gym.gym.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateTestemunhoDTO(
    @NotBlank(message = "Nome é obrigatório") String nome,
    @NotBlank(message = "Texto é obrigatório") String texto,
    Integer stars,
    String status,
    String cargo,
    String foto
) {}
