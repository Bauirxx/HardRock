package com.gym.notification.consumer;

import com.gym.notification.service.EmailService;
import com.gym.notification.service.EmailTemplateService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class PlanoEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(PlanoEventConsumer.class);
    private final EmailService emailService;
    private final EmailTemplateService templates;

    public PlanoEventConsumer(EmailService emailService, EmailTemplateService templates) {
        this.emailService = emailService;
        this.templates = templates;
    }

    @RabbitListener(queues = "plano.eventos")
    public void processarEventoPlano(Map<String, Object> event) {
        String eventType = str(event, "eventType");
        log.info("[PLANO] Evento recebido: {}", eventType);

        String clienteEmail = str(event, "clienteEmail");
        String clienteNome = str(event, "clienteNome");
        String servicoNome = str(event, "servicoNome");
        String dataFim = str(event, "dataFim");

        if (clienteEmail == null || clienteEmail.isBlank()) {
            log.warn("[PLANO] Evento {} sem email de cliente — email não enviado", eventType);
            return;
        }

        switch (eventType) {
            case "PLANO_CRIADO" -> {
                String valor = str(event, "precoPago");
                String dataInicio = str(event, "dataInicio");
                String trainerNome = str(event, "trainerNome");
                String html = templates.planoActivado(clienteNome, servicoNome, dataInicio, dataFim, valor, trainerNome);
                emailService.enviar(clienteEmail, "Subscrição Activada — " + servicoNome, html);
            }
            case "PLANO_EXPIRANDO" -> {
                int dias = intVal(event, "diasRestantes", 3);
                String html = templates.avisoVencimento(clienteNome, servicoNome, dataFim, dias);
                emailService.enviar(clienteEmail, "Aviso: Plano a expirar em " + dias + " dias", html);
            }
            case "PLANO_EXPIRADO" -> {
                String html = templates.planoExpirado(clienteNome, servicoNome, dataFim);
                emailService.enviar(clienteEmail, "O teu plano de " + servicoNome + " expirou", html);
            }
            case "PLANO_CANCELADO" -> {
                String html = templates.planoCancelado(clienteNome, servicoNome);
                emailService.enviar(clienteEmail, "Plano cancelado — " + servicoNome, html);
            }
            default -> log.debug("[PLANO] Evento ignorado: {}", eventType);
        }
    }

    @RabbitListener(queues = "notificacao.email")
    public void processarNotificacaoEmail(Map<String, Object> event) {
        String eventType = str(event, "eventType");
        log.info("[NOTIF] Evento recebido: {}", eventType);

        switch (eventType) {
            case "NOVO_CLIENTE_ALOCADO" -> {
                String ptEmail = str(event, "trainerEmail");
                String ptNome = str(event, "trainerNome");
                String clienteNome = str(event, "clienteNome");
                String servicoNome = str(event, "servicoNome");
                String dataFim = str(event, "dataFim");

                if (ptEmail != null && !ptEmail.isBlank()) {
                    String html = templates.novoClienteAlocado(ptNome, clienteNome, servicoNome, dataFim);
                    emailService.enviar(ptEmail, "Novo cliente alocado — " + clienteNome, html);
                }
            }
            case "BOAS_VINDAS" -> {
                String email = str(event, "email");
                String nome = str(event, "nome");
                if (email != null) {
                    emailService.enviar(email, "Bem-vindo ao Hard Rock Gym!", templates.boasVindas(nome, email));
                }
            }
            case "VERIFICACAO_EMAIL" -> {
                String email = str(event, "email");
                String nome = str(event, "nome");
                String codigo = str(event, "codigo");
                if (email != null) {
                    emailService.enviar(email, "Verificação de Email", templates.verificacaoEmail(nome, codigo));
                }
            }
            case "RECUPERACAO_SENHA" -> {
                String email = str(event, "email");
                String nome = str(event, "nome");
                String token = str(event, "token");
                if (email != null) {
                    emailService.enviar(email, "Recuperação de Password", templates.recuperacaoSenha(nome, token));
                }
            }
            case "SENHA_REDEFINIDA" -> {
                String email = str(event, "email");
                String nome = str(event, "nome");
                if (email != null) {
                    emailService.enviar(email, "Password Alterada", templates.senhaRedefinida(nome));
                }
            }
            case "COMPRA_CONFIRMADA" -> {
                String email = str(event, "clienteEmail");
                String nome = str(event, "clienteNome");
                String resumo = str(event, "resumoItens");
                String total = str(event, "valorTotal");
                if (email != null) {
                    emailService.enviar(email, "Compra Confirmada", templates.confirmacaoCompra(nome, resumo, total));
                }
            }
            case "PAGAMENTO_ATRASO" -> {
                String email = str(event, "clienteEmail");
                String nome = str(event, "clienteNome");
                String servico = str(event, "servicoNome");
                String valor = str(event, "valorDevido");
                String vencimento = str(event, "dataVencimento");
                if (email != null) {
                    emailService.enviar(email, "Pagamento em Atraso", templates.pagamentoEmAtraso(nome, servico, valor, vencimento));
                }
            }
            case "CONVITE" -> {
                String email = str(event, "email");
                String nome = str(event, "nome");
                String role = str(event, "role");
                String token = str(event, "inviteToken");
                if (email != null) {
                    emailService.enviar(email, "Convite — Hard Rock Gym", templates.convite(nome, email, role, token));
                }
            }
            case "CREDENCIAIS_ACESSO" -> {
                String email = str(event, "email");
                String nome = str(event, "nome");
                String senha = str(event, "senha");
                if (email != null) {
                    emailService.enviar(email, "As tuas credenciais — Hard Rock Gym", templates.credenciaisAcesso(nome, email, senha));
                }
            }
            default -> log.debug("[NOTIF] Evento ignorado: {}", eventType);
        }
    }

    private String str(Map<String, Object> map, String key) {
        Object v = map.get(key);
        return v != null ? v.toString() : null;
    }

    private int intVal(Map<String, Object> map, String key, int defaultVal) {
        Object v = map.get(key);
        if (v instanceof Number n) return n.intValue();
        try { return Integer.parseInt(v.toString()); } catch (Exception e) { return defaultVal; }
    }
}
