package com.gym.payment.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gym.common.dto.ApiResponse;
import com.gym.payment.dto.CheckoutRequestDTO;
import com.gym.payment.dto.TransacaoDTO;
import com.gym.payment.service.PagamentoService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {

    private static final Logger log = LoggerFactory.getLogger(CheckoutController.class);

    private final PagamentoService service;
    private final ObjectMapper objectMapper;

    public CheckoutController(PagamentoService service, ObjectMapper objectMapper) {
        this.service = service;
        this.objectMapper = objectMapper;
    }

    // Inicia um pagamento — devolve o checkout_url para redirecionar o cliente
    @PostMapping
    public ResponseEntity<ApiResponse<TransacaoDTO>> criar(@Valid @RequestBody CheckoutRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.criado(service.criarCheckout(dto)));
    }

    // Estado do pagamento (a página de retorno consulta isto). Refresca do PaySuite se pendente.
    @GetMapping("/{referencia}")
    public ResponseEntity<ApiResponse<TransacaoDTO>> estado(@PathVariable String referencia) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.consultarEstado(referencia)));
    }

    // Webhook do PaySuite — PÚBLICO (chamado pelo gateway, não pelo browser)
    @PostMapping("/webhook")
    public ResponseEntity<String> webhook(
            @RequestBody String rawPayload,
            @RequestHeader(value = "X-Webhook-Signature", required = false) String assinatura) {
        try {
            JsonNode payload = objectMapper.readTree(rawPayload);
            service.processarWebhook(rawPayload, assinatura, payload);
        } catch (Exception e) {
            log.error("[WEBHOOK] Erro ao processar: {}", e.getMessage());
            // Responde 200 mesmo em erro de parsing para o PaySuite não repetir indefinidamente,
            // mas devolve 401 se a assinatura for inválida (exceção propagada abaixo).
            if (e instanceof com.gym.common.exception.BusinessException be) {
                return ResponseEntity.status(be.getStatus()).body(be.getMessage());
            }
        }
        return ResponseEntity.ok("ok");
    }

    // Listagem (admin ou por cliente)
    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransacaoDTO>>> listar(
            @RequestParam(required = false) UUID clienteId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(clienteId, pageable)));
    }
}
