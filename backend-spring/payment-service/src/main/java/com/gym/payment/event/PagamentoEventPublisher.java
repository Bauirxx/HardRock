package com.gym.payment.event;

import com.gym.payment.config.RabbitMQConfig;
import com.gym.payment.model.TransacaoEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class PagamentoEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(PagamentoEventPublisher.class);
    private final RabbitTemplate rabbitTemplate;

    public PagamentoEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void publicarConcluido(TransacaoEntity t) {
        publicar(RabbitMQConfig.ROUTING_CONCLUIDO, t, null);
    }

    public void publicarFalhou(TransacaoEntity t, String erro) {
        publicar(RabbitMQConfig.ROUTING_FALHOU, t, erro);
    }

    private void publicar(String routingKey, TransacaoEntity t, String erro) {
        Map<String, Object> evento = new HashMap<>();
        evento.put("transacao_id", t.getId() != null ? t.getId().toString() : null);
        evento.put("referencia", t.getReferencia());
        evento.put("contexto", t.getContexto());
        evento.put("contexto_id", t.getContextoId() != null ? t.getContextoId().toString() : null);
        evento.put("cliente_id", t.getClienteId() != null ? t.getClienteId().toString() : null);
        evento.put("valor", t.getValor());
        evento.put("metodo", t.getMetodo());
        evento.put("transaction_id", t.getTransactionId());
        evento.put("estado", t.getEstado());
        if (erro != null) evento.put("erro", erro);

        try {
            rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_PAGAMENTO, routingKey, evento);
            log.info("[EVENTO] {} publicado para ref {} ({} {})",
                    routingKey, t.getReferencia(), t.getContexto(), t.getContextoId());
        } catch (Exception e) {
            log.error("[EVENTO] Falha ao publicar {} para ref {}: {}", routingKey, t.getReferencia(), e.getMessage());
        }
    }
}
