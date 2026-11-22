package com.gym.auth.controller;

import com.gym.auth.dto.*;
import com.gym.auth.model.UserEntity;
import com.gym.auth.repository.UserRepository;
import com.gym.auth.service.AuthService;
import com.gym.common.dto.ApiResponse;
import com.gym.common.exception.BusinessException;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> register(@Valid @RequestBody RegisterRequestDTO dto) {
        AuthResponseDTO result = authService.register(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.criado(result));
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> login(@Valid @RequestBody LoginRequestDTO dto) {
        AuthResponseDTO result = authService.login(dto);
        return ResponseEntity.ok(ApiResponse.sucesso(result, "Login realizado com sucesso"));
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponseDTO>> refresh(@Valid @RequestBody RefreshTokenRequestDTO dto) {
        AuthResponseDTO result = authService.refresh(dto);
        return ResponseEntity.ok(ApiResponse.sucesso(result, "Token renovado com sucesso"));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponseDTO>> me(Authentication auth) {
        String email = auth.getName();
        UserEntity user = userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new BusinessException("Utilizador não encontrado", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.sucesso(UserResponseDTO.from(user)));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            throw new BusinessException("Email é obrigatório");
        }
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.sucesso(
                Map.of("message", "Email de recuperação enviado"),
                "Verifica a tua caixa de email"
        ));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> resetPassword(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String password = body.get("password");
        if (token == null || password == null) {
            throw new BusinessException("Token e password são obrigatórios");
        }
        authService.resetPassword(token, password);
        return ResponseEntity.ok(ApiResponse.sucesso(
                Map.of("message", "Password redefinida com sucesso"),
                "Podes iniciar sessão com a nova password"
        ));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> changePassword(
            @RequestBody Map<String, String> body, Authentication auth) {
        String currentPassword = body.get("current_password");
        String newPassword = body.get("new_password");
        if (currentPassword == null || newPassword == null) {
            throw new BusinessException("Password actual e nova são obrigatórias");
        }
        authService.changePassword(auth.getName(), currentPassword, newPassword);
        return ResponseEntity.ok(ApiResponse.sucesso(
                Map.of("message", "Password alterada com sucesso")
        ));
    }
}
