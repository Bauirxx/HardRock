package com.gym.common.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.Deque;
import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting em memória para endpoints sensíveis (login, forgot-password, reset-password).
 * OWASP A07 — Authentication Failures. Janela deslizante por IP.
 *
 * Não protege contra ataques distribuídos (muitos IPs). Para isso usar WAF/Cloudflare
 * à frente do Caddy. Aqui cobre o caso realista de brute-force de um só atacante.
 */
@Component
public class LoginRateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(LoginRateLimitFilter.class);

    @Value("${app.security.rate-limit.login.max-attempts:10}")
    private int maxAttempts;

    @Value("${app.security.rate-limit.login.window-seconds:60}")
    private int windowSeconds;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final ConcurrentHashMap<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    private static final java.util.Set<String> PROTECTED_PATHS = java.util.Set.of(
            "/api/v1/auth/login",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password"
    );

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String path = request.getRequestURI();
        if (!"POST".equalsIgnoreCase(request.getMethod()) || !PROTECTED_PATHS.contains(path)) {
            chain.doFilter(request, response);
            return;
        }

        String key = clientIp(request) + "|" + path;
        Instant now = Instant.now();
        Instant cutoff = now.minusSeconds(windowSeconds);

        Deque<Instant> window = hits.computeIfAbsent(key, k -> new LinkedList<>());
        synchronized (window) {
            while (!window.isEmpty() && window.peekFirst().isBefore(cutoff)) {
                window.pollFirst();
            }
            if (window.size() >= maxAttempts) {
                long retryAfter = windowSeconds - (now.getEpochSecond() - window.peekFirst().getEpochSecond());
                log.warn("Rate limit bloqueado: ip={}, path={}, window-hits={}", clientIp(request), path, window.size());
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setHeader("Retry-After", String.valueOf(Math.max(1, retryAfter)));
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                objectMapper.writeValue(response.getOutputStream(), Map.of(
                        "sucesso", false,
                        "mensagem", "Demasiadas tentativas. Tenta novamente em alguns segundos.",
                        "codigo", "RATE_LIMITED"
                ));
                return;
            }
            window.addLast(now);
        }

        chain.doFilter(request, response);
    }

    private static String clientIp(HttpServletRequest req) {
        String xff = req.getHeader("X-Forwarded-For");
        if (xff != null && !xff.isBlank()) {
            // Primeiro IP da lista = cliente original
            int comma = xff.indexOf(',');
            return (comma > 0 ? xff.substring(0, comma) : xff).trim();
        }
        String real = req.getHeader("X-Real-IP");
        if (real != null && !real.isBlank()) {
            return real.trim();
        }
        return req.getRemoteAddr();
    }
}
