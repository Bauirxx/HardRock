package com.gym.member.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.member.dto.*;
import com.gym.member.service.PersonalTrainerService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/personal-trainers")
public class PersonalTrainerController {

    private final PersonalTrainerService ptService;

    public PersonalTrainerController(PersonalTrainerService ptService) {
        this.ptService = ptService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<PersonalTrainerDTO>>> listar(Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.sucesso(ptService.listarTodos(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PersonalTrainerDTO>> buscar(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.sucesso(ptService.buscarPorId(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<PersonalTrainerDTO>> criar(@Valid @RequestBody CreatePersonalTrainerDTO dto) {
        PersonalTrainerDTO result = ptService.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(result));
    }

    @RequestMapping(value = "/{id}", method = { RequestMethod.PUT, RequestMethod.PATCH })
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<PersonalTrainerDTO>> actualizar(
            @PathVariable UUID id, @RequestBody UpdatePersonalTrainerDTO dto) {
        return ResponseEntity.ok(ApiResponse.sucesso(ptService.actualizar(id, dto)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Void>> desactivar(@PathVariable UUID id) {
        ptService.desactivar(id);
        return ResponseEntity.ok(ApiResponse.sucesso(null, "Personal Trainer desactivado com sucesso"));
    }
}
