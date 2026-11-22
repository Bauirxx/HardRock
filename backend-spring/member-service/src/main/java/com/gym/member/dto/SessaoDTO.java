package com.gym.member.dto;

import com.gym.member.model.SessaoEntity;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record SessaoDTO(
    UUID id, UUID clienteId, UUID trainerId, LocalDate data,
    String horaInicio, String horaFim, String status, String notas, String local,
    boolean activo, LocalDateTime dataCriacao
) {
    public static SessaoDTO from(SessaoEntity s) {
        return new SessaoDTO(
            s.getId(), s.getClienteId(), s.getTrainerId(), s.getData(),
            s.getHoraInicio(), s.getHoraFim(), s.getStatus(), s.getNotas(), s.getLocal(),
            s.isActivo(), s.getDataCriacao()
        );
    }
}
