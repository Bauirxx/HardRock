package com.gym.store.consumer;

import com.gym.store.service.VendaService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

// Conclui a venda quando o pagamento é confirmado pelo gateway.
@Component
public class PagamentoConsumer {

    private static final Logger log = LoggerFactory.getLogger(PagamentoConsumer.class);
    private final VendaService vendaService;

    public PagamentoConsumer(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @RabbitListener(queues = "pagamento.store")
    public void aoPagamento(Map<String, Object> evento) {
        String contexto = str(evento.get("contexto"));
        String estado = str(evento.get("estado"));
        String contextoId = str(evento.get("contexto_id"));

        // Só interessa VENDAS pagas
        if (!"VENDA".equalsIgnoreCase(contexto) || !"PAID".equalsIgnoreCase(estado) || contextoId == null) {
            return;
        }
        try {
            vendaService.concluir(UUID.fromString(contextoId));
            log.info("[PAGAMENTO] Venda {} concluída após pagamento", contextoId);
        } catch (Exception e) {
            log.warn("[PAGAMENTO] Não foi possível concluir a venda {}: {}", contextoId, e.getMessage());
        }
    }

    private String str(Object o) { return o != null ? o.toString() : null; }
}
