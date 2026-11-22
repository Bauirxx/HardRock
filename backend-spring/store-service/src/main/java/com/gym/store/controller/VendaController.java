package com.gym.store.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.store.dto.*;
import com.gym.store.service.VendaService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/vendas")
public class VendaController {

    private final VendaService vendaService;

    public VendaController(VendaService vendaService) {
        this.vendaService = vendaService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<VendaDTO>>> listar(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(vendaService.listarTodas(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<VendaDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(vendaService.buscarPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<VendaDTO>> criar(@Valid @RequestBody CreateVendaDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(vendaService.criar(dto)));
    }

    @PatchMapping("/{id}/concluir")
    public ResponseEntity<ApiResponse<VendaDTO>> concluir(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(vendaService.concluir(id), "Venda concluída"));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<VendaDTO>> cancelar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(vendaService.cancelar(id), "Venda cancelada"));
    }
}
