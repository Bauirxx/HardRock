package com.gym.gym.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.gym.dto.*;
import com.gym.gym.service.TestemunhoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/testemunhos")
public class TestemunhoController {

    private final TestemunhoService service;

    public TestemunhoController(TestemunhoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<TestemunhoDTO>>> listar(
            @RequestParam(required = false) String status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(status, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TestemunhoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.buscarPorId(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<TestemunhoDTO>> criar(@Valid @RequestBody CreateTestemunhoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(service.criar(dto)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<TestemunhoDTO>> actualizarPut(
            @PathVariable UUID id, @RequestBody CreateTestemunhoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<TestemunhoDTO>> actualizarPatch(
            @PathVariable UUID id, @RequestBody CreateTestemunhoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Testemunho removido"));
    }
}
