package com.gym.gym.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.gym.dto.*;
import com.gym.gym.service.TransformacaoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/transformacoes")
public class TransformacaoController {

    private final TransformacaoService service;

    public TransformacaoController(TransformacaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TransformacaoDTO>>> listar(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransformacaoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.buscarPorId(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<TransformacaoDTO>> criar(@Valid @RequestBody CreateTransformacaoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(service.criar(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<TransformacaoDTO>> actualizarPut(
            @PathVariable UUID id, @RequestBody CreateTransformacaoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<TransformacaoDTO>> actualizarPatch(
            @PathVariable UUID id, @RequestBody CreateTransformacaoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Transformação removida"));
    }
}
