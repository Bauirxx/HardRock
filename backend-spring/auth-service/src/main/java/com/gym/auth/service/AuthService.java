package com.gym.auth.service;

import com.gym.auth.dto.*;
import com.gym.auth.model.UserEntity;
import com.gym.auth.repository.UserRepository;
import com.gym.common.enums.Perfil;
import com.gym.common.exception.BusinessException;
import com.gym.common.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailEventPublisher emailEvents;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtUtil jwtUtil, AuthenticationManager authenticationManager,
                       EmailEventPublisher emailEvents) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.emailEvents = emailEvents;
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Email já está registado", HttpStatus.CONFLICT);
        }

        UserEntity user = new UserEntity();
        user.setNome(dto.nome());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setPerfil(Perfil.USUARIO_NORMAL);

        user = userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getPerfil().name(), user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        try {
            emailEvents.boasVindas(user.getNome(), user.getEmail());
        } catch (Exception e) {
            log.warn("[AUTH] Falha ao publicar email de boas-vindas: {}", e.getMessage());
        }

        return new AuthResponseDTO(accessToken, refreshToken, UserResponseDTO.from(user));
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.email(), dto.password())
        );

        UserEntity user = userRepository.findByEmailAndActivoTrue(dto.email())
                .orElseThrow(() -> new BusinessException("Utilizador não encontrado", HttpStatus.NOT_FOUND));

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getPerfil().name(), user.getId());
        String refreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return new AuthResponseDTO(accessToken, refreshToken, UserResponseDTO.from(user));
    }

    public AuthResponseDTO refresh(RefreshTokenRequestDTO dto) {
        if (!jwtUtil.isTokenValid(dto.refreshToken()) || !jwtUtil.isRefreshToken(dto.refreshToken())) {
            throw new BusinessException("Refresh token inválido", HttpStatus.UNAUTHORIZED);
        }

        String email = jwtUtil.getEmailFromToken(dto.refreshToken());
        UserEntity user = userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new BusinessException("Utilizador não encontrado", HttpStatus.NOT_FOUND));

        String accessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getPerfil().name(), user.getId());
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail());

        return new AuthResponseDTO(accessToken, newRefreshToken, UserResponseDTO.from(user));
    }

    @Transactional
    public void forgotPassword(String email) {
        UserEntity user = userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new BusinessException("Email não encontrado", HttpStatus.NOT_FOUND));

        String resetToken = jwtUtil.generateAccessToken(user.getEmail(), "RESET", user.getId());

        try {
            emailEvents.recuperacaoSenha(user.getNome(), user.getEmail(), resetToken);
        } catch (Exception e) {
            log.warn("[AUTH] Falha ao publicar email de recuperação: {}", e.getMessage());
        }
    }

    @Transactional
    public void resetPassword(String token, String newPassword) {
        if (!jwtUtil.isTokenValid(token)) {
            throw new BusinessException("Token inválido ou expirado", HttpStatus.BAD_REQUEST);
        }

        String email = jwtUtil.getEmailFromToken(token);
        UserEntity user = userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new BusinessException("Utilizador não encontrado", HttpStatus.NOT_FOUND));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        try {
            emailEvents.senhaRedefinida(user.getNome(), user.getEmail());
        } catch (Exception e) {
            log.warn("[AUTH] Falha ao publicar email de senha redefinida: {}", e.getMessage());
        }
    }

    @Transactional
    public void changePassword(String email, String currentPassword, String newPassword) {
        UserEntity user = userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new BusinessException("Utilizador não encontrado", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BusinessException("Password actual incorrecta", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
