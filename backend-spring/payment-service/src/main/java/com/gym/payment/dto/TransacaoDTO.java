package com.gym.payment.dto;

import com.gym.payment.model.TransacaoEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record TransacaoDTO(
    UUID id, String referencia, String paysuiteId, BigDecimal valor, String metodo,
    String estado, String contexto, UUID contextoId, UUID clienteId, String descricao,
    String checkoutUrl, String transactionId, LocalDateTime paidAt, String erro,
    LocalDateTime dataCriacao
) {
    public static TransacaoDTO from(TransacaoEntity t) {
        return new TransacaoDTO(
            t.getId(), t.getReferencia(), t.getPaysuiteId(), t.getValor(), t.getMetodo(),
            t.getEstado(), t.getContexto(), t.getContextoId(), t.getClienteId(), t.getDescricao(),
            t.getCheckoutUrl(), t.getTransactionId(), t.getPaidAt(), t.getErro(),
            t.getDataCriacao()
        );
    }
}
