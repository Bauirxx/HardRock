package com.gym.auth.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class EmailEventPublisher {

    private static final Logger log = LoggerFactory.getLogger(EmailEventPublisher.class);
    private static final String EXCHANGE = "notificacao.exchange";
    private static final String ROUTING = "notificacao.email";

    private final RabbitTemplate rabbitTemplate;

    public EmailEventPublisher(RabbitTemplate rabbitTemplate) {
        this.rabbitTemplate = rabbitTemplate;
    }

    public void boasVindas(String nome, String email) {
        publish(Map.of("eventType", "BOAS_VINDAS", "nome", nome, "email", email));
    }

    public void verificacaoEmail(String nome, String email, String codigo) {
        publish(Map.of("eventType", "VERIFICACAO_EMAIL", "nome", nome, "email", email, "codigo", codigo));
    }

    public void recuperacaoSenha(String nome, String email, String token) {
        publish(Map.of("eventType", "RECUPERACAO_SENHA", "nome", nome, "email", email, "token", token));
    }

    public void senhaRedefinida(String nome, String email) {
        publish(Map.of("eventType", "SENHA_REDEFINIDA", "nome", nome, "email", email));
    }

    public void convite(String nome, String email, String role, String inviteToken) {
        publish(Map.of("eventType", "CONVITE", "nome", nome, "email", email, "role", role, "inviteToken", inviteToken));
    }

    // Credenciais de acesso enviadas quando a inscrição é feita presencialmente pelo staff
    public void credenciaisAcesso(String nome, String email, String senha) {
        publish(Map.of("eventType", "CREDENCIAIS_ACESSO", "nome", nome, "email", email, "senha", senha));
    }

    private void publish(Map<String, String> event) {
        try {
            rabbitTemplate.convertAndSend(EXCHANGE, ROUTING, event);
            log.info("[EMAIL EVENT] {} publicado para {}", event.get("eventType"), event.get("email"));
        } catch (Exception e) {
            log.warn("[EMAIL EVENT] Falha ao publicar {}: {}", event.get("eventType"), e.getMessage());
        }
    }
}
