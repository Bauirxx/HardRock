package com.gym.member.service;

import com.gym.common.enums.TipoCliente;
import com.gym.common.exception.BusinessException;
import com.gym.common.exception.ResourceNotFoundException;
import com.gym.member.dto.*;
import com.gym.member.model.ClienteEntity;
import com.gym.member.repository.ClienteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteEventPublisher eventPublisher;

    public ClienteService(ClienteRepository clienteRepository, ClienteEventPublisher eventPublisher) {
        this.clienteRepository = clienteRepository;
        this.eventPublisher = eventPublisher;
    }

    public Page<ClienteDTO> listarTodos(Pageable pageable) {
        return clienteRepository.findByActivoTrue(pageable).map(ClienteDTO::from);
    }

    public Page<ClienteDTO> listarPorTipo(TipoCliente tipo, Pageable pageable) {
        return clienteRepository.findByTipoClienteAndActivoTrue(tipo, pageable).map(ClienteDTO::from);
    }

    public java.util.List<ClienteDTO> listarPorTrainer(UUID personalTrainerId) {
        return clienteRepository.findByPersonalTrainerIdAndActivoTrue(personalTrainerId)
                .stream().map(ClienteDTO::from).toList();
    }

    public ClienteDTO buscarPorId(UUID id) {
        ClienteEntity c = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));
        return ClienteDTO.from(c);
    }

    @Transactional
    public ClienteDTO criar(CreateClienteDTO dto, String realizadoPor) {
        if (dto.bilheteIdentidade() != null && clienteRepository.existsByBilheteIdentidade(dto.bilheteIdentidade())) {
            throw new BusinessException("Bilhete de identidade já registado", HttpStatus.CONFLICT);
        }

        // Defaults seguros — o frontend nem sempre envia todos os campos
        TipoCliente tipo = dto.tipoCliente() != null ? dto.tipoCliente() : TipoCliente.INTERNO;
        com.gym.common.enums.Sexo sexo = dto.sexo() != null ? dto.sexo() : com.gym.common.enums.Sexo.MASCULINO;

        ClienteEntity c = new ClienteEntity();
        c.setNome(dto.nome());
        c.setNumeroTelefone(dto.numeroTelefone() != null ? dto.numeroTelefone() : "000000000");
        c.setFoto(dto.foto());
        c.setBilheteIdentidade(dto.bilheteIdentidade());
        c.setEstadoCivil(dto.estadoCivil());
        c.setSexo(sexo);
        c.setNumeroFamiliar(dto.numeroFamiliar());
        c.setTipoCliente(tipo);
        c.setUserId(dto.userId());
        c.setEmail(dto.email());
        c.setIdade(dto.idade());
        c.setEndereco(dto.endereco());
        c.setNotas(dto.notas());
        c.setPlanoAtual(dto.planoAtual());
        c.setHistoricoDoencas(dto.historicoDoencas());
        c.setPraticavaExercicios(dto.praticavaExercicios());
        c.setDetalhesExercicios(dto.detalhesExercicios());

        if (tipo == TipoCliente.INTERNO) {
            c.setServicoAtrelado(dto.servicoAtrelado());
            c.setDataAdmissao(dto.dataAdmissao() != null ? dto.dataAdmissao() : java.time.LocalDate.now());
            c.setPersonalTrainerId(dto.personalTrainerId());
        }

        c = clienteRepository.save(c);

        eventPublisher.publicar("CLIENTE_CRIADO", c.getId(), realizadoPor, null, ClienteDTO.from(c));

        return ClienteDTO.from(c);
    }

    @Transactional
    public ClienteDTO actualizar(UUID id, UpdateClienteDTO dto, String realizadoPor) {
        ClienteEntity c = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));

        ClienteDTO anterior = ClienteDTO.from(c);

        if (dto.nome() != null) c.setNome(dto.nome());
        if (dto.numeroTelefone() != null) c.setNumeroTelefone(dto.numeroTelefone());
        if (dto.foto() != null) c.setFoto(dto.foto());
        if (dto.bilheteIdentidade() != null) {
            if (!dto.bilheteIdentidade().equals(c.getBilheteIdentidade())
                    && clienteRepository.existsByBilheteIdentidade(dto.bilheteIdentidade())) {
                throw new BusinessException("Bilhete de identidade já registado", HttpStatus.CONFLICT);
            }
            c.setBilheteIdentidade(dto.bilheteIdentidade());
        }
        if (dto.estadoCivil() != null) c.setEstadoCivil(dto.estadoCivil());
        if (dto.sexo() != null) c.setSexo(dto.sexo());
        if (dto.numeroFamiliar() != null) c.setNumeroFamiliar(dto.numeroFamiliar());
        if (dto.tipoCliente() != null) c.setTipoCliente(dto.tipoCliente());
        if (dto.servicoAtrelado() != null) c.setServicoAtrelado(dto.servicoAtrelado());
        if (dto.dataAdmissao() != null) c.setDataAdmissao(dto.dataAdmissao());
        if (dto.personalTrainerId() != null) c.setPersonalTrainerId(dto.personalTrainerId());
        if (dto.activo() != null) c.setActivo(dto.activo());
        if (dto.status() != null) c.setActivo(!"inactive".equalsIgnoreCase(dto.status()));
        if (dto.email() != null) c.setEmail(dto.email());
        if (dto.idade() != null) c.setIdade(dto.idade());
        if (dto.endereco() != null) c.setEndereco(dto.endereco());
        if (dto.notas() != null) c.setNotas(dto.notas());
        if (dto.planoAtual() != null) c.setPlanoAtual(dto.planoAtual());
        if (dto.historicoDoencas() != null) c.setHistoricoDoencas(dto.historicoDoencas());
        if (dto.praticavaExercicios() != null) c.setPraticavaExercicios(dto.praticavaExercicios());
        if (dto.detalhesExercicios() != null) c.setDetalhesExercicios(dto.detalhesExercicios());

        c = clienteRepository.save(c);

        eventPublisher.publicar("CLIENTE_ACTUALIZADO", c.getId(), realizadoPor, anterior, ClienteDTO.from(c));

        return ClienteDTO.from(c);
    }

    @Transactional
    public void desactivar(UUID id, String realizadoPor) {
        ClienteEntity c = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente", id));

        ClienteDTO anterior = ClienteDTO.from(c);
        c.setActivo(false);
        clienteRepository.save(c);

        eventPublisher.publicar("CLIENTE_REMOVIDO", c.getId(), realizadoPor, anterior, null);
    }
}
