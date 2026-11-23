package com.gym.member.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.member.dto.*;
import com.gym.member.service.SolicitacaoInscricaoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/inscricoes")
public class SolicitacaoInscricaoController {

    private final SolicitacaoInscricaoService service;

    public SolicitacaoInscricaoController(SolicitacaoInscricaoService service) {
        this.service = service;
    }

    // Submissão pública a partir de /ginasio/inscricao (visitante anónimo)
    @PostMapping
    public ResponseEntity<ApiResponse<SolicitacaoDTO>> criar(@Valid @RequestBody CreateSolicitacaoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(service.criar(dto)));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Page<SolicitacaoDTO>>> listar(
            @RequestParam(required = false) String status, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(status, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<SolicitacaoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.buscarPorId(id)));
    }

    // Aprovar / rejeitar / repor pendente — body: { "status": "aprovado" }
    @PatchMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<SolicitacaoDTO>> actualizar(
            @PathVariable UUID id, @RequestBody Map<String, String> body, Authentication auth) {
        String status = body.get("status");
        String revistoPor = auth != null ? auth.getName() : null;
        return ResponseEntity.ok(ApiResponse.sucesso(service.actualizarEstado(id, status, revistoPor)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Solicitação removida"));
    }
}
