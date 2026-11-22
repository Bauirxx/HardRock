package com.gym.gym.dto;

import com.gym.gym.model.PagamentoEntity;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record PagamentoDTO(
    UUID id, UUID clienteId, BigDecimal valor, String tipo, String metodo,
    String descricao, String status, LocalDate dataVencimento,
    LocalDateTime dataPagamento, boolean activo, LocalDateTime dataCriacao
) {
    public static PagamentoDTO from(PagamentoEntity p) {
        return new PagamentoDTO(
            p.getId(), p.getClienteId(), p.getValor(), p.getTipo(), p.getMetodo(),
            p.getDescricao(), p.getStatus(), p.getDataVencimento(),
            p.getDataPagamento(), p.isActivo(), p.getDataCriacao()
        );
    }
}
