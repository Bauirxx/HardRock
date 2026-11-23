package com.gym.gym.client;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

/**
 * Chama o endpoint interno do member-service para obter nome/email de um cliente.
 * Usado para enriquecer os emails de subscrição (expiração/renovação).
 */
@Component
public class MemberClient {

    private static final Logger log = LoggerFactory.getLogger(MemberClient.class);

    private final RestClient restClient;

    public MemberClient(@Value("${member-service.url:http://localhost:8082}") String baseUrl) {
        this.restClient = RestClient.builder().baseUrl(baseUrl).build();
    }

    public record Cliente(String nome, String email) {}

    public Cliente buscar(UUID clienteId) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, String> body = restClient.get()
                    .uri("/api/v1/internal/clientes/{id}", clienteId)
                    .retrieve()
                    .body(Map.class);
            if (body == null) return null;
            return new Cliente(body.getOrDefault("nome", ""), body.getOrDefault("email", ""));
        } catch (Exception e) {
            log.warn("[MEMBER] Falha ao obter cliente {}: {}", clienteId, e.getMessage());
            return null;
        }
    }
}
