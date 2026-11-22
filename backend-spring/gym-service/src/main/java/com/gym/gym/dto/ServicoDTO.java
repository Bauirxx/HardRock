package com.gym.gym.dto;

import com.gym.gym.model.ServicoEntity;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ServicoDTO(
    UUID id, String nome, String descricao,
    BigDecimal precoMensal, BigDecimal precoTrimestral, BigDecimal precoAnual,
    Integer duracaoSessao, Integer sessoesSemanais, Integer maxAlunos,
    boolean incluiPt, boolean destaque, String cor,
    List<String> beneficios, List<String> horarios,
    boolean activo, LocalDateTime dataCriacao
) {
    public static ServicoDTO from(ServicoEntity s) {
        return new ServicoDTO(
            s.getId(), s.getNome(), s.getDescricao(),
            s.getPrecoMensal(), s.getPrecoTrimestral(), s.getPrecoAnual(),
            s.getDuracaoSessao(), s.getSessoesSemanais(), s.getMaxAlunos(),
            s.isIncluiPt(), s.isDestaque(), s.getCor(),
            s.getBeneficios(), s.getHorarios(),
            s.isActivo(), s.getDataCriacao()
        );
    }
}
