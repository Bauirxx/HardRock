package com.gym.gym.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.gym.dto.*;
import com.gym.gym.service.ConfiguracaoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/configuracoes")
public class ConfiguracaoController {

    private final ConfiguracaoService service;

    public ConfiguracaoController(ConfiguracaoService service) {
        this.service = service;
    }

    // Público — a landing page lê as configurações do ginásio
    @GetMapping
    public ResponseEntity<ApiResponse<Page<ConfiguracaoDTO>>> listar(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ConfiguracaoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.buscarPorId(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<ConfiguracaoDTO>> criar(@RequestBody CreateConfiguracaoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(service.criar(dto)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<ConfiguracaoDTO>> actualizar(
            @PathVariable UUID id, @RequestBody CreateConfiguracaoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<ConfiguracaoDTO>> actualizarPut(
            @PathVariable UUID id, @RequestBody CreateConfiguracaoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }
}
