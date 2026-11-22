package com.gym.member.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.member.dto.*;
import com.gym.member.service.SessaoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sessoes")
public class SessaoController {

    private final SessaoService service;

    public SessaoController(SessaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SessaoDTO>>> listar(
            @RequestParam(required = false) UUID trainerId,
            @RequestParam(required = false) UUID clienteId,
            Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(trainerId, clienteId, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SessaoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.buscarPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SessaoDTO>> criar(@RequestBody CreateSessaoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(service.criar(dto)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<SessaoDTO>> actualizar(
            @PathVariable UUID id, @RequestBody CreateSessaoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SessaoDTO>> actualizarPut(
            @PathVariable UUID id, @RequestBody CreateSessaoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Sessão removida"));
    }
}
