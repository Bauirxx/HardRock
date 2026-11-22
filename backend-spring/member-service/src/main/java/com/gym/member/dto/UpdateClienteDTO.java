package com.gym.member.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.gym.common.enums.EstadoCivil;
import com.gym.common.enums.Sexo;
import com.gym.common.enums.TipoCliente;

import java.time.LocalDate;
import java.util.UUID;

public record UpdateClienteDTO(
    String nome,
    @JsonAlias({"telefone"}) String numeroTelefone,
    @JsonAlias({"foto_url"}) String foto,
    String bilheteIdentidade,
    EstadoCivil estadoCivil,
    @JsonAlias({"genero"}) Sexo sexo,
    String numeroFamiliar,
    TipoCliente tipoCliente,
    String servicoAtrelado,
    LocalDate dataAdmissao,
    UUID personalTrainerId,
    Boolean activo,
    String status,
    // Campos ricos da ficha do cliente
    String email,
    Integer idade,
    String endereco,
    String notas,
    String planoAtual,
    String historicoDoencas,
    Boolean praticavaExercicios,
    String detalhesExercicios
) {}
