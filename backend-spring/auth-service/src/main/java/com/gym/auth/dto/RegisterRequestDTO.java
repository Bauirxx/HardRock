package com.gym.auth.dto;

import jakarta.validation.constraints.*;

public record RegisterRequestDTO(
    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 3, message = "Nome deve ter no mínimo 3 caracteres")
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Formato de email inválido")
    String email,

    @NotBlank(message = "Password é obrigatória")
    @Size(min = 8, message = "Password deve ter no mínimo 8 caracteres")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
        message = "Password deve conter maiúscula, minúscula, número e carácter especial"
    )
    String password
) {}
