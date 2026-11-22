package com.gym.member.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.member.dto.*;
import com.gym.member.service.LeadService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/leads")
public class LeadController {

    private final LeadService service;

    public LeadController(LeadService service) {
        this.service = service;
    }

    // Submissão pública a partir do formulário da landing page
    @PostMapping
    public ResponseEntity<ApiResponse<LeadDTO>> criar(@Valid @RequestBody CreateLeadDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(service.criar(dto)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Page<LeadDTO>>> listar(
            @RequestParam(required = false) String status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(status, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<LeadDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.buscarPorId(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<LeadDTO>> actualizar(
            @PathVariable UUID id, @RequestBody CreateLeadDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<LeadDTO>> actualizarPut(
            @PathVariable UUID id, @RequestBody CreateLeadDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Lead removido"));
    }
}
