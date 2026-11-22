package com.gym.store.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.common.enums.CategoriaProduto;
import com.gym.store.dto.*;
import com.gym.store.service.ProdutoService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProdutoDTO>>> catalogo(
            @RequestParam(required = false) CategoriaProduto categoria, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(produtoService.listarCatalogo(categoria, pageable)));
    }

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Page<ProdutoDTO>>> listarTodos(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(produtoService.listarTodos(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProdutoDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(produtoService.buscarPorId(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<ProdutoDTO>> criar(@Valid @RequestBody CreateProdutoDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(produtoService.criar(dto)));
    }

    @RequestMapping(value = "/{id}", method = { RequestMethod.PUT, RequestMethod.PATCH })
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<ProdutoDTO>> actualizar(
            @PathVariable UUID id, @RequestBody CreateProdutoDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(produtoService.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable UUID id) {
        produtoService.desactivar(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Produto desactivado"));
    }
}
