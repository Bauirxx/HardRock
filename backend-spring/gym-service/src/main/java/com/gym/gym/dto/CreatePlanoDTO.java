package com.gym.gym.dto;

import com.gym.common.enums.TipoPlano;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CreatePlanoDTO(
    @NotNull(message = "ID do cliente é obrigatório") UUID clienteId,
    @NotNull(message = "ID do serviço é obrigatório") UUID servicoId,
    @NotNull(message = "Tipo de plano é obrigatório") TipoPlano tipoPlano,
    @NotNull(message = "Data de início é obrigatória") LocalDate dataInicio,
    @NotNull(message = "Data de fim é obrigatória") LocalDate dataFim,
    @NotNull(message = "Preço pago é obrigatório") @DecimalMin("0.01") BigDecimal precoPago,
    UUID personalTrainerId
) {}
