package com.gym.member.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.common.enums.TipoCliente;
import com.gym.member.dto.*;
import com.gym.member.service.ClienteService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ClienteDTO>>> listar(
            @RequestParam(required = false) TipoCliente tipo, Pageable pageable) {
        Page<ClienteDTO> result = tipo != null
                ? clienteService.listarPorTipo(tipo, pageable)
                : clienteService.listarTodos(pageable);
        return ResponseEntity.ok(ApiResponse.sucesso(result));
    }

    // Alunos atribuídos a um personal trainer (usado pelo dashboard do trainer)
    @GetMapping("/por-trainer/{ptId}")
    public ResponseEntity<ApiResponse<java.util.List<ClienteDTO>>> porTrainer(@PathVariable UUID ptId) {
        return ResponseEntity.ok(ApiResponse.sucesso(clienteService.listarPorTrainer(ptId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(clienteService.buscarPorId(id)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ClienteDTO>> criar(
            @Valid @RequestBody CreateClienteDTO dto, Authentication auth) {
        ClienteDTO result = clienteService.criar(dto, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(result));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDTO>> actualizar(
            @PathVariable UUID id, @Valid @RequestBody UpdateClienteDTO dto, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.sucesso(clienteService.actualizar(id, dto, auth.getName())));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<ApiResponse<ClienteDTO>> actualizarParcial(
            @PathVariable UUID id, @RequestBody UpdateClienteDTO dto, Authentication auth) {
        return ResponseEntity.ok(ApiResponse.sucesso(clienteService.actualizar(id, dto, auth.getName())));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable UUID id, Authentication auth) {
        clienteService.desactivar(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Cliente desactivado com sucesso"));
    }
}
