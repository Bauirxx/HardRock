package com.gym.notification.controller;

import com.gym.common.dto.ApiResponse;
import com.gym.common.exception.BusinessException;
import com.gym.notification.service.EmailService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/email")
public class EmailController {

    private final EmailService emailService;

    @Value("${spring.mail.username:}")
    private String remetente;

    @Value("${app.name:Hard Rock Gym}")
    private String appName;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    // Envia um email de teste real. Se não indicar destino, envia para o remetente configurado.
    @PostMapping("/testar")
    @PreAuthorize("hasAnyRole('DONO_DO_GINASIO', 'SUPER_USER')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> testar(@RequestBody(required = false) Map<String, String> body) {
        String para = (body != null && body.get("para") != null && !body.get("para").isBlank())
                ? body.get("para").trim()
                : remetente;

        if (para == null || para.isBlank()) {
            throw new BusinessException(
                "Configure o email do remetente ou indique um destinatário.", HttpStatus.BAD_REQUEST);
        }

        String html = "<div style='font-family:Arial,sans-serif;max-width:560px;margin:auto;background:#111;color:#fff;border-radius:16px;overflow:hidden'>"
            + "<div style='background:linear-gradient(135deg,#dc2626,#7f1d1d);padding:32px 40px'>"
            + "<h1 style='margin:0;font-size:24px;color:#fff'>" + appName + "</h1>"
            + "<p style='margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:13px'>Teste de configuração de email</p></div>"
            + "<div style='padding:32px 40px'>"
            + "<p style='font-size:15px'>Este é um email de teste.</p>"
            + "<p style='color:#aaa;font-size:14px;line-height:1.6'>Se recebeu esta mensagem, o servidor SMTP está a funcionar "
            + "correctamente e o sistema já pode enviar credenciais, recuperações de senha e avisos.</p>"
            + "<div style='margin-top:20px;padding:14px 18px;background:#1a1a1a;border-radius:10px;border-left:3px solid #dc2626'>"
            + "<span style='color:#22c55e;font-weight:bold'>&#10003; SMTP operacional</span></div>"
            + "</div><div style='padding:18px 40px;background:#0a0a0a;color:#666;font-size:12px'>" + appName + "</div></div>";

        emailService.enviar(para, "[" + appName + "] Teste de Email", html);

        return ResponseEntity.ok(ApiResponse.sucesso(
            Map.of("enviado_para", para),
            "Email de teste enviado para " + para));
    }
}
