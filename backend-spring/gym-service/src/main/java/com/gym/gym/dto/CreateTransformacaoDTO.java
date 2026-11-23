package com.gym.gym.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTransformacaoDTO(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 100)
    String nome,

    @NotBlank(message = "Imagem 'antes' é obrigatória")
    String antes,

    @NotBlank(message = "Imagem 'depois' é obrigatória")
    String depois,

    @Size(max = 50)
    String tempo,

    String resultado,

    Integer ordem
) {}
