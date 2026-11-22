package com.gym.gym.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.gym.dto.*;
import com.gym.gym.service.ServicoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/servicos")
public class ServicoController {

    private final ServicoService servicoService;

    public ServicoController(ServicoService servicoService) {
        this.servicoService = servicoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ServicoDTO>>> listar(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(servicoService.listarActivos(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ServicoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(servicoService.buscarPorId(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<ServicoDTO>> criar(@Valid @RequestBody CreateServicoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(servicoService.criar(dto)));
    }

    @RequestMapping(value = "/{id}", method = { RequestMethod.PUT, RequestMethod.PATCH })
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<ServicoDTO>> actualizar(
            @PathVariable UUID id, @RequestBody CreateServicoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(servicoService.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable UUID id) {
        servicoService.desactivar(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Serviço desactivado com sucesso"));
    }
}
