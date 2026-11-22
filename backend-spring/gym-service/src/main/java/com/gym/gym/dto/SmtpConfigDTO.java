package com.gym.gym.dto;

// Configuração SMTP para uso INTERNO (notification-service). Inclui a password —
// nunca deve ser exposto pelo gateway público.
public record SmtpConfigDTO(
    String host,
    Integer port,
    String username,
    String password,
    boolean configured
) {}
