package com.gym.member.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import java.time.LocalDate;
import java.util.UUID;

public record CreateSessaoDTO(
    @JsonAlias({"client", "cliente_id"}) UUID clienteId,
    @JsonAlias({"trainer", "trainer_id"}) UUID trainerId,
    LocalDate data,
    String horaInicio,
    String horaFim,
    String status,
    String notas,
    String local
) {}
