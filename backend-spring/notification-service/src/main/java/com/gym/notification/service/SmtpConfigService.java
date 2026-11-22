package com.gym.notification.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Properties;

/**
 * Fornece o JavaMailSender a usar: se as Configurações do ginásio tiverem SMTP
 * definido (email + App Password), usa ESSE; senão, o do .env (fallback).
 * A config é lida do gym-service (endpoint interno) e ficada em cache curto.
 */
@Service
public class SmtpConfigService {

    private static final Logger log = LoggerFactory.getLogger(SmtpConfigService.class);
    private static final long TTL_MS = 20_000; // recarrega a cada 20s

    private final JavaMailSender fallbackSender;   // baseado no .env (spring.mail.*)
    private final RestClient http;

    @Value("${spring.mail.username:}")
    private String fallbackFrom;

    // cache
    private long carregadoEm = 0;
    private JavaMailSender senderDinamico;
    private String fromDinamico;
    private String assinaturaAtual = "";

    public SmtpConfigService(JavaMailSender fallbackSender,
                             @Value("${gym-service.url:http://gym-gym-service:8083}") String gymServiceUrl) {
        this.fallbackSender = fallbackSender;
        this.http = RestClient.builder().baseUrl(gymServiceUrl).build();
    }

    public synchronized JavaMailSender getSender() {
        refrescarSeNecessario();
        return senderDinamico != null ? senderDinamico : fallbackSender;
    }

    public synchronized String getFrom() {
        refrescarSeNecessario();
        return (fromDinamico != null && !fromDinamico.isBlank()) ? fromDinamico : fallbackFrom;
    }

    private void refrescarSeNecessario() {
        if (System.currentTimeMillis() - carregadoEm < TTL_MS) return;
        carregadoEm = System.currentTimeMillis();
        try {
            JsonNode c = http.get().uri("/api/v1/internal/smtp").retrieve().body(JsonNode.class);
            if (c == null || !c.path("configured").asBoolean(false)) {
                if (senderDinamico != null) log.info("[SMTP] Configuração da BD removida — a usar .env");
                senderDinamico = null;
                fromDinamico = null;
                assinaturaAtual = "";
                return;
            }
            String host = c.path("host").asText("smtp.gmail.com");
            int port = c.path("port").isMissingNode() || c.path("port").isNull() ? 587 : c.path("port").asInt(587);
            String user = c.path("username").asText();
            String pass = c.path("password").asText();

            String assinatura = host + "|" + port + "|" + user + "|" + pass.hashCode();
            if (assinatura.equals(assinaturaAtual)) return; // sem alterações
            assinaturaAtual = assinatura;

            JavaMailSenderImpl s = new JavaMailSenderImpl();
            s.setHost(host);
            s.setPort(port);
            s.setUsername(user);
            s.setPassword(pass);
            Properties p = s.getJavaMailProperties();
            p.put("mail.smtp.auth", "true");
            p.put("mail.smtp.starttls.enable", "true");
            p.put("mail.smtp.connectiontimeout", "5000");
            p.put("mail.smtp.timeout", "5000");
            p.put("mail.smtp.writetimeout", "5000");
            senderDinamico = s;
            fromDinamico = user;
            log.info("[SMTP] A usar configuração das Definições: {} ({})", user, host);
        } catch (Exception e) {
            // Se não conseguir contactar o gym-service, mantém o que tinha (ou fallback)
            log.warn("[SMTP] Não foi possível obter config da BD ({}), a usar .env/último", e.getMessage());
        }
    }
}
