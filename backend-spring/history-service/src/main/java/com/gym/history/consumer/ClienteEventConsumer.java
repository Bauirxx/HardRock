package com.gym.history.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gym.history.model.HistoricoEntity;
import com.gym.history.repository.HistoricoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
public class ClienteEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(ClienteEventConsumer.class);
    private final HistoricoRepository historicoRepository;
    private final ObjectMapper objectMapper;

    public ClienteEventConsumer(HistoricoRepository historicoRepository, ObjectMapper objectMapper) {
        this.historicoRepository = historicoRepository;
        this.objectMapper = objectMapper;
    }

    @RabbitListener(queues = "cliente.eventos")
    public void processarEvento(Map<String, Object> event) {
        try {
            String eventType = (String) event.get("eventType");
            String clienteId = (String) event.get("clienteId");
            String realizadoPor = (String) event.getOrDefault("realizadoPor", "sistema");

            HistoricoEntity h = new HistoricoEntity();
            h.setClienteId(UUID.fromString(clienteId));
            h.setAccao(eventType);
            h.setDescricao("Evento: " + eventType);
            h.setRealizadoPor(realizadoPor);

            Object anterior = event.get("dadosAnteriores");
            if (anterior != null && !"".equals(anterior)) {
                h.setDadosAnteriores(objectMapper.writeValueAsString(anterior));
            }
            Object novo = event.get("dadosNovos");
            if (novo != null && !"".equals(novo)) {
                h.setDadosNovos(objectMapper.writeValueAsString(novo));
            }

            historicoRepository.save(h);
            log.info("[HISTORICO] {} registado para cliente {}", eventType, clienteId);
        } catch (Exception e) {
            log.error("[HISTORICO] Erro ao processar evento: {}", e.getMessage());
        }
    }

    @RabbitListener(queues = "plano.eventos")
    public void processarEventoPlano(Map<String, Object> event) {
        try {
            String eventType = (String) event.get("eventType");
            String clienteId = (String) event.get("clienteId");

            HistoricoEntity h = new HistoricoEntity();
            h.setClienteId(UUID.fromString(clienteId));
            h.setAccao(eventType);
            h.setDescricao("Plano " + event.get("planoId") + " - Estado: " + event.get("estado"));
            h.setRealizadoPor("sistema");
            h.setDadosNovos(objectMapper.writeValueAsString(event));

            historicoRepository.save(h);
            log.info("[HISTORICO] {} registado para plano de cliente {}", eventType, clienteId);
        } catch (Exception e) {
            log.error("[HISTORICO] Erro ao processar evento plano: {}", e.getMessage());
        }
    }
}
