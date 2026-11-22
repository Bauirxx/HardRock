package com.gym.history.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.history.model.HistoricoEntity;
import com.gym.history.repository.HistoricoRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/historico")
public class HistoricoController {

    private final HistoricoRepository historicoRepository;

    public HistoricoController(HistoricoRepository historicoRepository) {
        this.historicoRepository = historicoRepository;
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ApiResponse<Page<HistoricoEntity>>> listarPorCliente(
            @PathVariable UUID clienteId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(
                historicoRepository.findByClienteIdOrderByDataRegistroDesc(clienteId, pageable)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<HistoricoEntity>>> listarTodos(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(historicoRepository.findAll(pageable)));
    }
}
