package com.gym.member.dto;

import com.gym.member.model.LeadEntity;
import java.time.LocalDateTime;
import java.util.UUID;

public record LeadDTO(
    UUID id, String nome, String telefone, String email, String interesse,
    String mensagem, String fonte, String status, boolean activo, LocalDateTime dataCriacao
) {
    public static LeadDTO from(LeadEntity l) {
        return new LeadDTO(
            l.getId(), l.getNome(), l.getTelefone(), l.getEmail(), l.getInteresse(),
            l.getMensagem(), l.getFonte(), l.getStatus(), l.isActivo(), l.getDataCriacao()
        );
    }
}
