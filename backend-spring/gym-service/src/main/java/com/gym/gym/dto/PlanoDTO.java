package com.gym.gym.dto;

import com.gym.common.enums.EstadoPlano;
import com.gym.common.enums.TipoPlano;
import com.gym.gym.model.PlanoEntity;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PlanoDTO(
    UUID id, UUID clienteId, UUID servicoId, String servicoNome,
    TipoPlano tipoPlano, LocalDate dataInicio, LocalDate dataFim,
    BigDecimal precoPago, EstadoPlano estado, UUID personalTrainerId,
    boolean activo, LocalDateTime dataCriacao
) {
    public static PlanoDTO from(PlanoEntity p) {
        String svcNome = p.getServico() != null ? p.getServico().getNome() : null;
        return new PlanoDTO(p.getId(), p.getClienteId(), p.getServicoId(), svcNome,
                p.getTipoPlano(), p.getDataInicio(), p.getDataFim(), p.getPrecoPago(),
                p.getEstado(), p.getPersonalTrainerId(), p.isActivo(), p.getDataCriacao());
    }
}
