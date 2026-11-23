package com.gym.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateSolicitacaoDTO(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 120, message = "Nome demasiado longo")
    String nome,

    @NotBlank(message = "Telefone é obrigatório")
    @Size(max = 40)
    @Pattern(regexp = "^[\\d+()\\-\\s]*$", message = "Telefone inválido")
    String telefone,

    @Email(message = "Email inválido")
    @Size(max = 160)
    String email,

    @Size(max = 120)
    String planoPretendido,

    @Size(max = 2000, message = "Mensagem demasiado longa")
    String mensagem
) {}
