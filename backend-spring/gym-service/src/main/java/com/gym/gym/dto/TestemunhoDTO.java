package com.gym.gym.dto;

import com.gym.gym.model.TestemunhoEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public record TestemunhoDTO(
    UUID id, String nome, String texto, int stars, String status,
    String cargo, String foto, boolean activo, LocalDateTime dataCriacao
) {
    public static TestemunhoDTO from(TestemunhoEntity t) {
        return new TestemunhoDTO(
            t.getId(), t.getNome(), t.getTexto(), t.getStars(), t.getStatus(),
            t.getCargo(), t.getFoto(), t.isActivo(), t.getDataCriacao()
        );
    }
}
