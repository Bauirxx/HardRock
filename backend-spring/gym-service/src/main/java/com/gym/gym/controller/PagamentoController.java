package com.gym.gym.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.gym.dto.*;
import com.gym.gym.service.PagamentoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/pagamentos")
@PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
public class PagamentoController {

    private final PagamentoService service;

    public PagamentoController(PagamentoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PagamentoDTO>>> listar(
            @RequestParam(required = false) String status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(status, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PagamentoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.buscarPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PagamentoDTO>> criar(@Valid @RequestBody CreatePagamentoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(service.criar(dto)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<PagamentoDTO>> actualizar(
            @PathVariable UUID id, @RequestBody CreatePagamentoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PagamentoDTO>> actualizarPut(
            @PathVariable UUID id, @RequestBody CreatePagamentoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Pagamento removido"));
    }
}
