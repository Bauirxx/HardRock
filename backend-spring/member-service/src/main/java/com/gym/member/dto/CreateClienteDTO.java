package com.gym.member.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.gym.common.enums.EstadoCivil;
import com.gym.common.enums.Sexo;
import com.gym.common.enums.TipoCliente;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.util.UUID;

public record CreateClienteDTO(
    @NotBlank(message = "Nome é obrigatório")
    String nome,

    @JsonAlias({"telefone"})
    String numeroTelefone,

    @JsonAlias({"foto_url"})
    String foto,

    String bilheteIdentidade,

    EstadoCivil estadoCivil,

    @JsonAlias({"genero"})
    Sexo sexo,

    String numeroFamiliar,

    TipoCliente tipoCliente,

    String servicoAtrelado,

    LocalDate dataAdmissao,

    UUID personalTrainerId,

    UUID userId,

    // Campos ricos da ficha do cliente
    String email,
    Integer idade,
    String endereco,
    String notas,
    String planoAtual,
    String historicoDoencas,
    boolean praticavaExercicios,
    String detalhesExercicios
) {}
