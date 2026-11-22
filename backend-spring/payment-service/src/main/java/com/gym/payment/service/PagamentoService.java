package com.gym.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.gym.common.exception.BusinessException;
import com.gym.common.exception.ResourceNotFoundException;
import com.gym.payment.client.PaySuiteClient;
import com.gym.payment.dto.CheckoutRequestDTO;
import com.gym.payment.dto.TransacaoDTO;
import com.gym.payment.event.PagamentoEventPublisher;
import com.gym.payment.model.TransacaoEntity;
import com.gym.payment.repository.TransacaoRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PagamentoService {

    private static final Logger log = LoggerFactory.getLogger(PagamentoService.class);

    private final TransacaoRepository repository;
    private final PaySuiteClient paySuite;
    private final PagamentoEventPublisher publisher;

    @Value("${paysuite.callback-url:}")
    private String callbackUrl;

    @Value("${paysuite.return-url:http://localhost:3000/pagamento/retorno}")
    private String returnUrlPadrao;

    @Value("${paysuite.webhook-secret:}")
    private String webhookSecret;

    @Value("${paysuite.webhook-required:false}")
    private boolean webhookRequired;

    public PagamentoService(TransacaoRepository repository, PaySuiteClient paySuite, PagamentoEventPublisher publisher) {
        this.repository = repository;
        this.paySuite = paySuite;
        this.publisher = publisher;
    }

    @Transactional
    public TransacaoDTO criarCheckout(CheckoutRequestDTO dto) {
        String contexto = dto.contexto() != null ? dto.contexto().toUpperCase() : "VENDA";
        String referencia = gerarReferencia(contexto);

        TransacaoEntity t = new TransacaoEntity();
        t.setReferencia(referencia);
        t.setValor(dto.valor());
        t.setMetodo(dto.metodo());
        t.setContexto(contexto);
        t.setContextoId(dto.contextoId());
        t.setClienteId(dto.clienteId());
        t.setDescricao(dto.descricao());
        t.setEstado("PENDING");

        String retorno = (dto.returnUrl() != null && !dto.returnUrl().isBlank())
                ? dto.returnUrl() : returnUrlPadrao;

        JsonNode data = paySuite.criarPagamento(
                dto.valor(), referencia, dto.descricao(), dto.metodo(),
                emptyToNull(callbackUrl), retorno + "?ref=" + referencia);

        if (data.has("id")) t.setPaysuiteId(data.get("id").asText());
        if (data.has("checkout_url")) t.setCheckoutUrl(data.get("checkout_url").asText());

        repository.save(t);
        log.info("[CHECKOUT] Criado {} ({} {}) valor {} -> {}",
                referencia, contexto, dto.contextoId(), dto.valor(), t.getCheckoutUrl());
        return TransacaoDTO.from(t);
    }

    // Consulta o estado; se ainda pendente, refresca a partir do PaySuite (útil quando o webhook não chega, ex. localhost)
    @Transactional
    public TransacaoDTO consultarEstado(String referencia) {
        TransacaoEntity t = repository.findByReferencia(referencia)
                .orElseThrow(() -> new ResourceNotFoundException("Transação", referencia));

        if ("PENDING".equals(t.getEstado()) && t.getPaysuiteId() != null) {
            JsonNode data = paySuite.consultarPagamento(t.getPaysuiteId());
            if (data != null && data.has("status")) {
                String status = data.get("status").asText();
                if ("paid".equalsIgnoreCase(status) || "completed".equalsIgnoreCase(status)) {
                    JsonNode tx = data.get("transaction");
                    String txId = (tx != null && tx.has("transaction_id")) ? tx.get("transaction_id").asText()
                            : (tx != null && tx.has("id")) ? tx.get("id").asText() : null;
                    marcarPago(t, txId);
                } else if ("failed".equalsIgnoreCase(status) || "cancelled".equalsIgnoreCase(status)) {
                    t.setEstado("FAILED");
                    repository.save(t);
                    publisher.publicarFalhou(t, "Pagamento " + status);
                }
            }
        }
        return TransacaoDTO.from(t);
    }

    // Processa o webhook do PaySuite (payment.success / payment.failed)
    @Transactional
    public void processarWebhook(String rawPayload, String assinatura, JsonNode payload) {
        // 1) Verificar assinatura (obrigatória em produção; em dev é opcional apenas se secret não configurado)
        boolean temSecret = webhookSecret != null && !webhookSecret.isBlank();
        if (webhookRequired && !temSecret) {
            log.error("[WEBHOOK] paysuite.webhook-secret não configurado mas paysuite.webhook-required=true");
            throw new BusinessException("Webhook secret não configurado no servidor", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        if (temSecret) {
            if (assinatura == null || !assinaturaValida(rawPayload, assinatura)) {
                log.warn("[WEBHOOK] Assinatura inválida de {} payload-len={}",
                        assinatura == null ? "null" : "presente", rawPayload.length());
                throw new BusinessException("Assinatura do webhook inválida", HttpStatus.UNAUTHORIZED);
            }
        }

        String evento = payload.path("event").asText("");
        JsonNode data = payload.path("data");
        String paysuiteId = data.path("id").asText(null);
        String reference = data.path("reference").asText(null);
        String requestId = payload.path("request_id").asText(null);

        TransacaoEntity t = null;
        if (reference != null) t = repository.findByReferencia(reference).orElse(null);
        if (t == null && paysuiteId != null) t = repository.findByPaysuiteId(paysuiteId).orElse(null);
        if (t == null) {
            log.warn("[WEBHOOK] Transação não encontrada (ref {}, id {})", reference, paysuiteId);
            return;
        }

        // 2) Idempotência — não reprocessar o mesmo request_id
        if (requestId != null && requestId.equals(t.getWebhookRequestId())) {
            log.info("[WEBHOOK] request_id {} já processado, ignorado", requestId);
            return;
        }
        t.setWebhookRequestId(requestId);

        // 3) Actualizar estado + publicar evento
        if (evento.contains("success")) {
            JsonNode tx = data.path("transaction");
            String txId = tx.path("id").asText(tx.path("transaction_id").asText(null));
            marcarPago(t, txId);
        } else if (evento.contains("failed")) {
            t.setEstado("FAILED");
            t.setErro(data.path("error").asText("Pagamento falhou"));
            repository.save(t);
            publisher.publicarFalhou(t, t.getErro());
            log.info("[WEBHOOK] Pagamento falhou ref {}", t.getReferencia());
        } else {
            repository.save(t);
        }
    }

    private void marcarPago(TransacaoEntity t, String txId) {
        if ("PAID".equals(t.getEstado())) return; // já pago
        t.setEstado("PAID");
        t.setTransactionId(txId);
        t.setPaidAt(LocalDateTime.now());
        repository.save(t);
        publisher.publicarConcluido(t);
        log.info("[PAGAMENTO] PAGO ref {} ({} {}) tx {}", t.getReferencia(), t.getContexto(), t.getContextoId(), txId);
    }

    public Page<TransacaoDTO> listar(UUID clienteId, Pageable pageable) {
        if (clienteId != null) {
            return repository.findByClienteIdAndActivoTrue(clienteId, pageable).map(TransacaoDTO::from);
        }
        return repository.findByActivoTrue(pageable).map(TransacaoDTO::from);
    }

    private boolean assinaturaValida(String payload, String assinatura) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) hex.append(String.format("%02x", b));
            return java.security.MessageDigest.isEqual(
                    hex.toString().getBytes(StandardCharsets.UTF_8),
                    assinatura.trim().getBytes(StandardCharsets.UTF_8));
        } catch (Exception e) {
            log.error("[WEBHOOK] Erro ao verificar assinatura: {}", e.getMessage());
            return false;
        }
    }

    private String gerarReferencia(String contexto) {
        String prefixo = contexto.startsWith("PLAN") ? "PLN" : "VEN";
        String ref = prefixo + System.currentTimeMillis() + UUID.randomUUID().toString().substring(0, 4);
        return ref.length() > 50 ? ref.substring(0, 50) : ref;
    }

    private String emptyToNull(String s) {
        return (s == null || s.isBlank()) ? null : s;
    }
}
