package com.gym.gym.consumer;

import com.gym.gym.service.PlanoService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

// Activa o plano/mensalidade quando o pagamento é confirmado pelo gateway.
@Component
public class PagamentoConsumer {

    private static final Logger log = LoggerFactory.getLogger(PagamentoConsumer.class);
    private final PlanoService planoService;

    public PagamentoConsumer(PlanoService planoService) {
        this.planoService = planoService;
    }

    @RabbitListener(queues = "pagamento.gym")
    public void aoPagamento(Map<String, Object> evento) {
        String contexto = str(evento.get("contexto"));
        String estado = str(evento.get("estado"));
        String contextoId = str(evento.get("contexto_id"));

        if (!"PLANO".equalsIgnoreCase(contexto) || !"PAID".equalsIgnoreCase(estado) || contextoId == null) {
            return;
        }
        try {
            planoService.activarPorPagamento(UUID.fromString(contextoId));
            log.info("[PAGAMENTO] Plano {} activado após pagamento", contextoId);
        } catch (Exception e) {
            log.warn("[PAGAMENTO] Não foi possível activar o plano {}: {}", contextoId, e.getMessage());
        }
    }

    private String str(Object o) { return o != null ? o.toString() : null; }
}
