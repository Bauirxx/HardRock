package com.gym.gym.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.gym.common.enums.EstadoPlano;
import com.gym.common.enums.TipoPlano;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record UpdatePlanoDTO(
    @JsonAlias({"trainer_id"}) UUID personalTrainerId,
    TipoPlano tipoPlano,
    LocalDate dataInicio,
    LocalDate dataFim,
    @JsonAlias({"valor_pago"}) BigDecimal precoPago,
    EstadoPlano estado
) {}
