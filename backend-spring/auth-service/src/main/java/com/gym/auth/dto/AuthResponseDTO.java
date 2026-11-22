package com.gym.auth.dto;

public record AuthResponseDTO(
    String accessToken,
    String refreshToken,
    UserResponseDTO utilizador
) {}
