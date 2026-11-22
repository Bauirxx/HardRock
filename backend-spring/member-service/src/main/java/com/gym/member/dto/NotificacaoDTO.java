package com.gym.member.dto;

import com.gym.member.model.NotificacaoEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public record NotificacaoDTO(
    UUID id, UUID userId, String titulo, String mensagem, String tipo,
    boolean lida, String link, LocalDateTime dataCriacao
) {
    public static NotificacaoDTO from(NotificacaoEntity n) {
        return new NotificacaoDTO(
            n.getId(), n.getUserId(), n.getTitulo(), n.getMensagem(), n.getTipo(),
            n.isLida(), n.getLink(), n.getDataCriacao()
        );
    }
}
