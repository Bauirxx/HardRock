package com.gym.member.service;

import com.gym.member.config.RabbitMQConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
public class ClienteEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(ClienteEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public ClienteEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicar(String eventType, UUID clienteId, String realizadoPor,
                         Object dadosAnteriores, Object dadosNovos) {
        Map<String, Object> event = Map.of(
            "eventType", eventType,
            "clienteId", clienteId.toString(),
            "realizadoPor", realizadoPor,
            "dadosAnteriores", dadosAnteriores != null ? dadosAnteriores : "",
            "dadosNovos", dadosNovos != null ? dadosNovos : "",
            "timestamp", LocalDateTime.now().toString(),
            "correlationId", UUID.randomUUID().toString()
        );

        try {
            rabbitTemplate.convertAndSend(
                RabbitMQConfig.EXCHANGE_CLIENTE,
                "cliente." + eventType.toLowerCase(),
                event
            );
            log.info("[EVENTO] {} publicado para cliente {}", eventType, clienteId);
        } catch (Exception e) {
            log.warn("[EVENTO] Falha ao publicar {}: {}", eventType, e.getMessage());
        }
    }
}
