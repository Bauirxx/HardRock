package com.gym.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CreateLeadDTO(
    @NotBlank(message = "Nome é obrigatório")
    @Size(max = 120, message = "Nome demasiado longo")
    String nome,

    @Size(max = 40, message = "Telefone demasiado longo")
    @Pattern(regexp = "^[\\d+()\\-\\s]*$", message = "Telefone inválido")
    String telefone,

    @Email(message = "Email inválido")
    @Size(max = 160, message = "Email demasiado longo")
    String email,

    @Size(max = 120)
    String interesse,

    @Size(max = 2000, message = "Mensagem demasiado longa")
    String mensagem,

    @Size(max = 80)
    String fonte,

    @Size(max = 40)
    String status
) {}
