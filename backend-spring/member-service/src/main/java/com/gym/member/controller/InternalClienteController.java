package com.gym.member.controller;

import com.gym.member.repository.ClienteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

/**
 * Endpoints internos service-to-service (não roteados pelo gateway → inacessíveis
 * pelo browser; cobertos por /api/v1/internal/** permitAll no SecurityConfig).
 * Usado pelo gym-service para enriquecer eventos de plano com nome/email do cliente.
 */
@RestController
@RequestMapping("/api/v1/internal/clientes")
public class InternalClienteController {

    private final ClienteRepository clienteRepository;

    public InternalClienteController(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, String>> resumo(@PathVariable UUID id) {
        return clienteRepository.findById(id)
                .map(c -> ResponseEntity.ok(Map.of(
                        "nome", nullSafe(c.getNome()),
                        "email", nullSafe(c.getEmail())
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    private String nullSafe(String s) {
        return s != null ? s : "";
    }
}
