package com.gym.payment.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

// Pedido de checkout vindo do frontend (loja ou plano)
public record CheckoutRequestDTO(
    @NotNull BigDecimal valor,
    String metodo,                                  // mpesa | emola | credit_card (opcional)
    @NotNull String contexto,                       // VENDA | PLANO
    @JsonAlias({"contexto_id"}) UUID contextoId,    // id da venda ou do plano
    @JsonAlias({"cliente_id"}) UUID clienteId,
    String descricao,
    @JsonAlias({"return_url"}) String returnUrl
) {}
