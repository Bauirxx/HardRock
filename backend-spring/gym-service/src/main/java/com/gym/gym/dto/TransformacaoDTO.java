package com.gym.gym.dto;

import com.gym.gym.model.TransformacaoEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransformacaoDTO(
    UUID id, String nome, String antes, String depois, String tempo,
    String resultado, int ordem, boolean activo, LocalDateTime dataCriacao
) {
    public static TransformacaoDTO from(TransformacaoEntity t) {
        return new TransformacaoDTO(
            t.getId(), t.getNome(), t.getAntes(), t.getDepois(), t.getTempo(),
            t.getResultado(), t.getOrdem(), t.isActivo(), t.getDataCriacao()
        );
    }
}
