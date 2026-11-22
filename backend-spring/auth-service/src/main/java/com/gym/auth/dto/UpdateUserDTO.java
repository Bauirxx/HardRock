package com.gym.auth.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.gym.common.enums.Perfil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateUserDTO(
    @JsonAlias({"full_name"})
    @Size(min = 3, message = "Nome deve ter no mínimo 3 caracteres")
    String nome,

    @Email(message = "Formato de email inválido")
    String email,

    @Size(min = 8, message = "Password deve ter no mínimo 8 caracteres")
    String password,

    Perfil perfil,

    Boolean activo,
    String status,

    // Campos detalhados de UI / trainer
    String role,
    String especialidade,
    String bio,
    String disponibilidade,
    String telefone,
    @JsonAlias({"foto_url"}) String fotoUrl
) {}
