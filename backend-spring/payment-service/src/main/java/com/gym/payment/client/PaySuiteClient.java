package com.gym.payment.client;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.common.exception.BusinessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * Cliente HTTP para o gateway de pagamentos PaySuite.
 * Docs: https://paysuite.tech/docs
 */
@Component
public class PaySuiteClient {

    private static final Logger log = LoggerFactory.getLogger(PaySuiteClient.class);

    private final RestClient http;

    public PaySuiteClient(
            @Value("${paysuite.base-url:https://paysuite.tech/api/v1}") String baseUrl,
            @Value("${paysuite.token:}") String token) {
        this.http = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + token)
                .defaultHeader("Accept", "application/json")
                .build();
    }

    /**
     * Cria um pagamento. Devolve o corpo "data" da resposta (id, checkout_url, status...).
     */
    public JsonNode criarPagamento(BigDecimal valor, String referencia, String descricao,
                                   String metodo, String callbackUrl, String returnUrl) {
        Map<String, Object> body = new HashMap<>();
        body.put("amount", valor.toPlainString());
        body.put("reference", referencia);
        if (descricao != null && !descricao.isBlank()) body.put("description", descricao);
        if (metodo != null && !metodo.isBlank()) body.put("method", metodo);
        if (callbackUrl != null && !callbackUrl.isBlank()) body.put("callback_url", callbackUrl);
        if (returnUrl != null && !returnUrl.isBlank()) body.put("return_url", returnUrl);

        try {
            JsonNode resp = http.post()
                    .uri("/payments")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(JsonNode.class);

            if (resp == null || !resp.has("data")) {
                throw new BusinessException("Resposta inválida do PaySuite", HttpStatus.BAD_GATEWAY);
            }
            return resp.get("data");
        } catch (BusinessException be) {
            throw be;
        } catch (Exception e) {
            log.error("[PaySuite] Falha ao criar pagamento (ref {}): {}", referencia, e.getMessage());
            throw new BusinessException("Falha ao comunicar com o gateway de pagamentos: " + e.getMessage(),
                    HttpStatus.BAD_GATEWAY);
        }
    }

    /**
     * Consulta o estado de um pagamento no PaySuite. Devolve o "data" ou null se falhar.
     */
    public JsonNode consultarPagamento(String paysuiteId) {
        try {
            JsonNode resp = http.get()
                    .uri("/payments/{id}", paysuiteId)
                    .retrieve()
                    .body(JsonNode.class);
            return (resp != null && resp.has("data")) ? resp.get("data") : null;
        } catch (Exception e) {
            log.warn("[PaySuite] Falha ao consultar pagamento {}: {}", paysuiteId, e.getMessage());
            return null;
        }
    }
}
