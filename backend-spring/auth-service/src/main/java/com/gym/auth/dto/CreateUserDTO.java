package com.gym.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.gym.common.enums.Perfil;
import jakarta.validation.constraints.*;

public record CreateUserDTO(
    @JsonAlias({"full_name"})
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "Password é obrigatória")
    @Size(min = 8, message = "Password deve ter no mínimo 8 caracteres")
    String password,

    Perfil perfil,

    // Campos detalhados de UI / trainer
    String role,
    String especialidade,
    String bio,
    String disponibilidade,
    String telefone,
    @JsonAlias({"foto_url"}) String fotoUrl
) {}
