package com.gym.member.dto;

import com.gym.member.model.SolicitacaoInscricaoEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public record SolicitacaoDTO(
    UUID id, String nome, String telefone, String email, String planoPretendido,
    String mensagem, String status, String revistoPor, UUID clienteId,
    boolean activo, LocalDateTime dataCriacao
) {
    public static SolicitacaoDTO from(SolicitacaoInscricaoEntity s) {
        return new SolicitacaoDTO(
            s.getId(), s.getNome(), s.getTelefone(), s.getEmail(), s.getPlanoPretendido(),
            s.getMensagem(), s.getStatus(), s.getRevistoPor(), s.getClienteId(),
            s.isActivo(), s.getDataCriacao()
        );
    }
}
