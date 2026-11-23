package com.gym.gym.service;

import com.gym.common.enums.EstadoPlano;
import com.gym.common.exception.BusinessException;
import com.gym.common.exception.ResourceNotFoundException;
import com.gym.gym.config.RabbitMQConfig;
import com.gym.gym.dto.*;
import com.gym.gym.model.PlanoEntity;
import com.gym.gym.model.ServicoEntity;
import com.gym.gym.repository.PlanoRepository;
import com.gym.gym.repository.ServicoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class PlanoService {

    private static final Logger log = LoggerFactory.getLogger(PlanoService.class);

    private final PlanoRepository planoRepository;
    private final ServicoRepository servicoRepository;
    private final RabbitTemplate rabbitTemplate;
    private final com.gym.gym.client.MemberClient memberClient;

    public PlanoService(PlanoRepository planoRepository, ServicoRepository servicoRepository,
                        RabbitTemplate rabbitTemplate, com.gym.gym.client.MemberClient memberClient) {
        this.planoRepository = planoRepository;
        this.servicoRepository = servicoRepository;
        this.rabbitTemplate = rabbitTemplate;
        this.memberClient = memberClient;
    }

    public Page<PlanoDTO> listarTodos(Pageable pageable) {
        return planoRepository.findByActivoTrue(pageable).map(PlanoDTO::from);
    }

    public PlanoDTO buscarPorId(UUID id) {
        PlanoEntity p = planoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano", id));
        return PlanoDTO.from(p);
    }

    public List<PlanoDTO> listarPorCliente(UUID clienteId) {
        return planoRepository.findByClienteId(clienteId).stream().map(PlanoDTO::from).toList();
    }

    @Transactional
    public PlanoDTO criar(CreatePlanoDTO dto) {
        ServicoEntity servico = servicoRepository.findById(dto.servicoId())
                .orElseThrow(() -> new ResourceNotFoundException("Serviço", dto.servicoId()));

        if (planoRepository.existsByClienteIdAndServicoIdAndEstado(
                dto.clienteId(), dto.servicoId(), EstadoPlano.ACTIVO)) {
            throw new BusinessException(
                    "Cliente já possui um plano activo para este serviço", HttpStatus.CONFLICT);
        }

        PlanoEntity plano = new PlanoEntity();
        plano.setClienteId(dto.clienteId());
        plano.setServicoId(dto.servicoId());
        plano.setTipoPlano(dto.tipoPlano());
        plano.setDataInicio(dto.dataInicio());
        plano.setDataFim(dto.dataFim());
        plano.setPrecoPago(dto.precoPago());
        plano.setEstado(EstadoPlano.ACTIVO);

        if (dto.personalTrainerId() != null) {
            plano.setPersonalTrainerId(dto.personalTrainerId());
        } else if (servico.isIncluiPt()) {
            UUID ptAlocado = autoAlocarPersonalTrainer();
            if (ptAlocado != null) {
                plano.setPersonalTrainerId(ptAlocado);
                log.info("[AUTO-ALLOC] PT {} alocado ao cliente {}", ptAlocado, dto.clienteId());
            }
        }

        plano = planoRepository.save(plano);

        publicarEvento("PLANO_CRIADO", plano);

        if (plano.getPersonalTrainerId() != null) {
            publicarNotificacaoPt(plano, servico.getNome());
        }

        return PlanoDTO.from(plano);
    }

    @Transactional
    public PlanoDTO actualizar(UUID id, UpdatePlanoDTO dto) {
        PlanoEntity plano = planoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano", id));

        boolean ptMudou = dto.personalTrainerId() != null
                && !dto.personalTrainerId().equals(plano.getPersonalTrainerId());

        if (dto.personalTrainerId() != null) plano.setPersonalTrainerId(dto.personalTrainerId());
        if (dto.tipoPlano() != null) plano.setTipoPlano(dto.tipoPlano());
        if (dto.dataInicio() != null) plano.setDataInicio(dto.dataInicio());
        if (dto.dataFim() != null) plano.setDataFim(dto.dataFim());
        if (dto.precoPago() != null) plano.setPrecoPago(dto.precoPago());
        if (dto.estado() != null) plano.setEstado(dto.estado());

        final PlanoEntity planoSalvo = planoRepository.save(plano);

        // Se um novo PT foi atribuído, notificar
        if (ptMudou && planoSalvo.getPersonalTrainerId() != null) {
            servicoRepository.findById(planoSalvo.getServicoId())
                    .ifPresent(s -> publicarNotificacaoPt(planoSalvo, s.getNome()));
        }

        return PlanoDTO.from(planoSalvo);
    }

    @Transactional
    public PlanoDTO cancelar(UUID id) {
        PlanoEntity plano = planoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Plano", id));

        plano.setEstado(EstadoPlano.CANCELADO);
        plano = planoRepository.save(plano);

        publicarEvento("PLANO_CANCELADO", plano);

        return PlanoDTO.from(plano);
    }

    // Activa um plano após confirmação de pagamento pelo gateway
    @Transactional
    public void activarPorPagamento(UUID planoId) {
        PlanoEntity plano = planoRepository.findById(planoId)
                .orElseThrow(() -> new ResourceNotFoundException("Plano", planoId));
        if (plano.getEstado() == EstadoPlano.ACTIVO) return;
        plano.setEstado(EstadoPlano.ACTIVO);
        planoRepository.save(plano);
        publicarEvento("PLANO_ACTIVADO", plano);
    }

    @Transactional
    public int verificarEExpirarPlanos() {
        List<PlanoEntity> expirados = planoRepository.findPlanosExpirados(LocalDate.now());
        for (PlanoEntity p : expirados) {
            p.setEstado(EstadoPlano.EXPIRADO);
            planoRepository.save(p);
            publicarEvento("PLANO_EXPIRADO", p);
        }
        return expirados.size();
    }

    @Transactional(readOnly = true)
    public List<PlanoDTO> verificarPlanosExpirando(int diasAntes) {
        LocalDate dataLimite = LocalDate.now().plusDays(diasAntes);
        List<PlanoEntity> expirando = planoRepository.findPlanosExpirando(dataLimite);
        for (PlanoEntity p : expirando) {
            publicarEvento("PLANO_EXPIRANDO", p);
        }
        return expirando.stream().map(PlanoDTO::from).toList();
    }

    private UUID autoAlocarPersonalTrainer() {
        List<PlanoEntity> todosActivos = planoRepository.findByActivoTrue(Pageable.unpaged()).getContent();
        Map<UUID, Long> cargaPorPt = new HashMap<>();

        for (PlanoEntity p : todosActivos) {
            if (p.getPersonalTrainerId() != null && p.getEstado() == EstadoPlano.ACTIVO) {
                cargaPorPt.merge(p.getPersonalTrainerId(), 1L, Long::sum);
            }
        }

        if (cargaPorPt.isEmpty()) {
            return null;
        }

        return Collections.min(cargaPorPt.entrySet(), Map.Entry.comparingByValue()).getKey();
    }

    private void publicarEvento(String eventType, PlanoEntity plano) {
        try {
            Map<String, Object> event = new HashMap<>();
            event.put("eventType", eventType);
            event.put("planoId", plano.getId().toString());
            event.put("clienteId", plano.getClienteId().toString());
            event.put("servicoId", plano.getServicoId().toString());
            event.put("estado", plano.getEstado().name());
            if (plano.getDataFim() != null) event.put("dataFim", plano.getDataFim().toString());
            if (plano.getDataInicio() != null) event.put("dataInicio", plano.getDataInicio().toString());
            if (plano.getPrecoPago() != null) event.put("precoPago", plano.getPrecoPago().toString());
            event.put("timestamp", LocalDateTime.now().toString());
            event.put("correlationId", UUID.randomUUID().toString());

            // Enriquecer com nome do serviço e dados do cliente (para o email)
            servicoRepository.findById(plano.getServicoId())
                    .ifPresent(s -> event.put("servicoNome", s.getNome()));
            var cliente = memberClient.buscar(plano.getClienteId());
            if (cliente != null) {
                if (cliente.nome() != null && !cliente.nome().isBlank()) event.put("clienteNome", cliente.nome());
                if (cliente.email() != null && !cliente.email().isBlank()) event.put("clienteEmail", cliente.email());
            }

            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_PLANO,
                    "plano." + eventType.toLowerCase(), event);
        } catch (Exception e) {
            log.warn("[EVENTO] Falha ao publicar {}: {}", eventType, e.getMessage());
        }
    }

    private void publicarNotificacaoPt(PlanoEntity plano, String servicoNome) {
        try {
            Map<String, Object> notif = Map.of(
                "eventType", "NOVO_CLIENTE_ALOCADO",
                "personalTrainerId", plano.getPersonalTrainerId().toString(),
                "clienteId", plano.getClienteId().toString(),
                "servicoNome", servicoNome,
                "dataFim", plano.getDataFim().toString(),
                "timestamp", LocalDateTime.now().toString()
            );
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NOTIFICACAO,
                    "notificacao.pt_alocado", notif);
        } catch (Exception e) {
            log.warn("[NOTIF] Falha ao notificar PT: {}", e.getMessage());
        }
    }
}
