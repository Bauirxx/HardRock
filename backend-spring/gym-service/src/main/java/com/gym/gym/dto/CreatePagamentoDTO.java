package com.gym.gym.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record CreatePagamentoDTO(
    @JsonAlias({"user", "client_id", "cliente"}) UUID clienteId,
    @NotNull BigDecimal valor,
    String tipo,
    String metodo,
    String descricao,
    String status,
    LocalDate dataVencimento,
    LocalDateTime dataPagamento
) {}
