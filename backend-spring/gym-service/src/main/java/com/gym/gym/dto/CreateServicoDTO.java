package com.gym.gym.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.util.List;

public record CreateServicoDTO(
    @NotBlank(message = "Nome é obrigatório") String nome,
    @NotBlank(message = "Descrição é obrigatória") String descricao,
    @NotNull(message = "Preço mensal é obrigatório") @DecimalMin("0.01") BigDecimal precoMensal,
    BigDecimal precoTrimestral,
    BigDecimal precoAnual,
    Integer duracaoSessao,
    Integer sessoesSemanais,
    Integer maxAlunos,
    boolean incluiPt,
    boolean destaque,
    String cor,
    List<String> beneficios,
    List<String> horarios
) {}
