package com.gym.notification.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);
    private final SmtpConfigService smtpConfig;

    public EmailService(SmtpConfigService smtpConfig) {
        this.smtpConfig = smtpConfig;
    }

    @Async
    public void enviar(String para, String assunto, String conteudoHtml) {
        try {
            // Usa a config SMTP das Definições (se existir) ou a do .env
            JavaMailSender sender = smtpConfig.getSender();
            String remetente = smtpConfig.getFrom();

            MimeMessage msg = sender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(msg, true, "UTF-8");
            if (remetente != null && !remetente.isBlank()) helper.setFrom(remetente);
            helper.setTo(para);
            helper.setSubject(assunto);
            helper.setText(conteudoHtml, true);
            sender.send(msg);
            log.info("[EMAIL] Enviado para {} - {}", para, assunto);
        } catch (Exception e) {
            log.error("[EMAIL] Falha ao enviar para {}: {}", para, e.getMessage());
        }
    }

    public String templateBoasVindas(String nome, String servico) {
        return "<div style='font-family:Arial;max-width:600px;margin:auto;'>"
             + "<h2 style='color:#FF6B2B;'>Bem-vindo ao Ginásio! 💪</h2>"
             + "<p>Olá <strong>" + nome + "</strong>,</p>"
             + "<p>A tua inscrição no serviço <strong>" + servico + "</strong> foi confirmada.</p>"
             + "<p>Estamos prontos para te ajudar a atingir os teus objectivos!</p>"
             + "<hr><p style='color:#888;font-size:12px;'>Gym Management System</p></div>";
    }

    public String templateVencimentoPlano(String nome, String servico, String dataFim) {
        return "<div style='font-family:Arial;max-width:600px;margin:auto;'>"
             + "<h2 style='color:#FF6B2B;'>Aviso de Vencimento</h2>"
             + "<p>Olá <strong>" + nome + "</strong>,</p>"
             + "<p>O teu plano de <strong>" + servico + "</strong> expira em <strong>" + dataFim + "</strong>.</p>"
             + "<p>Renova já para continuares a treinar connosco!</p>"
             + "<hr><p style='color:#888;font-size:12px;'>Gym Management System</p></div>";
    }

    public String templateConfirmacaoCompra(String nome, String resumo, String valorTotal) {
        return "<div style='font-family:Arial;max-width:600px;margin:auto;'>"
             + "<h2 style='color:#FF6B2B;'>Compra Confirmada ✅</h2>"
             + "<p>Olá <strong>" + nome + "</strong>,</p>"
             + "<p>A tua compra foi processada com sucesso:</p>"
             + "<div style='background:#f5f5f5;padding:15px;border-radius:8px;'>" + resumo + "</div>"
             + "<p><strong>Total: " + valorTotal + " MT</strong></p>"
             + "<hr><p style='color:#888;font-size:12px;'>Gym Management System</p></div>";
    }

    public String templatePtAlocado(String nomePt, String nomeCliente, String servico, String dataFim) {
        return "<div style='font-family:Arial;max-width:600px;margin:auto;'>"
             + "<h2 style='color:#FF6B2B;'>Novo Cliente Alocado</h2>"
             + "<p>Olá <strong>" + nomePt + "</strong>,</p>"
             + "<p>Um novo cliente foi alocado a ti:</p>"
             + "<ul><li>Cliente: <strong>" + nomeCliente + "</strong></li>"
             + "<li>Serviço: <strong>" + servico + "</strong></li>"
             + "<li>Válido até: <strong>" + dataFim + "</strong></li></ul>"
             + "<hr><p style='color:#888;font-size:12px;'>Gym Management System</p></div>";
    }
}
