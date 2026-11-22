package com.gym.member.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.member.dto.*;
import com.gym.member.service.NotificacaoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notificacoes")
public class NotificacaoController {

    private final NotificacaoService service;

    public NotificacaoController(NotificacaoService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<NotificacaoDTO>>> listar(
            @RequestParam(required = false) UUID userId, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.listar(userId, pageable)));
    }

    @PatchMapping("/{id}/lida")
    public ResponseEntity<ApiResponse<NotificacaoDTO>> marcarLida(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(service.marcarLida(id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> remover(@PathVariable UUID id) {
        service.remover(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Notificação removida"));
    }
}
