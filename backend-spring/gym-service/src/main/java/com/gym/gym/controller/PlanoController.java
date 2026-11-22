package com.gym.gym.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.gym.dto.*;
import com.gym.gym.service.PlanoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/planos")
public class PlanoController {

    private final PlanoService planoService;

    public PlanoController(PlanoService planoService) {
        this.planoService = planoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PlanoDTO>>> listar(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(planoService.listarTodos(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlanoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(planoService.buscarPorId(id)));
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<ApiResponse<List<PlanoDTO>>> listarPorCliente(@PathVariable UUID clienteId) {
        return ResponseEntity.ok(ApiResponse.sucesso(planoService.listarPorCliente(clienteId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PlanoDTO>> criar(@Valid @RequestBody CreatePlanoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(planoService.criar(dto)));
    }

    @RequestMapping(value = "/{id}", method = { RequestMethod.PUT, RequestMethod.PATCH })
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<PlanoDTO>> actualizar(
            @PathVariable UUID id, @RequestBody UpdatePlanoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(planoService.actualizar(id, dto), "Plano actualizado"));
    }

    @PatchMapping("/{id}/cancelar")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<PlanoDTO>> cancelar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(planoService.cancelar(id), "Plano cancelado"));
    }

    @PostMapping("/verificar-expiracoes")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> verificarExpiracoes() {
        int expirados = planoService.verificarEExpirarPlanos();
        List<PlanoDTO> expirando = planoService.verificarPlanosExpirando(3);
        return ResponseEntity.ok(ApiResponse.sucesso(Map.of(
                "expirados", expirados,
                "expirando_em_3_dias", expirando.size()
        )));
    }
}
