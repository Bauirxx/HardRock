package com.gym.auth.controller;

import com.gym.auth.dto.*;
import com.gym.auth.service.UserService;
import com.gym.common.dto.ApiResponse;
import com.gym.common.enums.Perfil;
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
@RequestMapping("/api/v1/auth/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Page<UserResponseDTO>>> listar(
            @RequestParam(required = false) String role, Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(userService.listar(role, pageable)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<UserResponseDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(userService.buscarPorId(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<UserResponseDTO>> criar(
            @Valid @RequestBody CreateUserDTO dto, Authentication auth) {
        Perfil perfilSolicitante = getPerfilFromAuth(auth);
        UserResponseDTO result = userService.criar(dto, perfilSolicitante);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(result));
    }

    @RequestMapping(value = "/{id}", method = { RequestMethod.PUT, RequestMethod.PATCH })
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<UserResponseDTO>> actualizar(
            @PathVariable UUID id, @RequestBody UpdateUserDTO dto, Authentication auth) {
        Perfil perfilSolicitante = getPerfilFromAuth(auth);
        return ResponseEntity.ok(ApiResponse.sucesso(userService.actualizar(id, dto, perfilSolicitante)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable UUID id, Authentication auth) {
        Perfil perfilSolicitante = getPerfilFromAuth(auth);
        userService.desactivar(id, perfilSolicitante);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Utilizador desactivado com sucesso"));
    }

    private Perfil getPerfilFromAuth(Authentication auth) {
        return auth.getAuthorities().stream()
                .map(a -> a.getAuthority().replace("ROLE_", ""))
                .map(Perfil::valueOf)
                .findFirst()
                .orElse(Perfil.USUARIO_NORMAL);
    }
}
