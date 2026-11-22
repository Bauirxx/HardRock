package com.gym.member.dto;

import com.gym.common.enums.EstadoCivil;
import com.gym.common.enums.Sexo;
import com.gym.common.enums.TipoCliente;
import com.gym.member.model.ClienteEntity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

public record ClienteDTO(
    UUID id,
    String nome,
    String numeroTelefone,
    String foto,
    String bilheteIdentidade,
    EstadoCivil estadoCivil,
    Sexo sexo,
    String numeroFamiliar,
    TipoCliente tipoCliente,
    String servicoAtrelado,
    LocalDate dataAdmissao,
    UUID personalTrainerId,
    UUID userId,
    String email,
    Integer idade,
    String endereco,
    String notas,
    String planoAtual,
    String historicoDoencas,
    boolean praticavaExercicios,
    String detalhesExercicios,
    boolean activo,
    LocalDateTime dataCriacao
) {
    public static ClienteDTO from(ClienteEntity c) {
        return new ClienteDTO(
            c.getId(), c.getNome(), c.getNumeroTelefone(), c.getFoto(),
            c.getBilheteIdentidade(), c.getEstadoCivil(), c.getSexo(),
            c.getNumeroFamiliar(), c.getTipoCliente(), c.getServicoAtrelado(),
            c.getDataAdmissao(), c.getPersonalTrainerId(), c.getUserId(),
            c.getEmail(), c.getIdade(), c.getEndereco(), c.getNotas(),
            c.getPlanoAtual(), c.getHistoricoDoencas(), c.isPraticavaExercicios(),
            c.getDetalhesExercicios(),
            c.isActivo(), c.getDataCriacao()
        );
    }
}
