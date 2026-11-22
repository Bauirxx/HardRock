package com.gym.gym.controller;

import com.gym.gym.dto.SmtpConfigDTO;
import com.gym.gym.model.ConfiguracaoEntity;
import com.gym.gym.repository.ConfiguracaoRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints INTERNOS (rede Docker) — NÃO são roteados pelo API Gateway,
 * portanto não são acessíveis pelo browser. Usados por outros serviços.
 */
@RestController
@RequestMapping("/api/v1/internal")
public class InternalConfigController {

    private final ConfiguracaoRepository repository;

    public InternalConfigController(ConfiguracaoRepository repository) {
        this.repository = repository;
    }

    // Devolve a configuração SMTP guardada nas Configurações (com password) para o notification-service.
    @GetMapping("/smtp")
    public SmtpConfigDTO smtp() {
        return repository.findAll(PageRequest.of(0, 1)).stream().findFirst()
                .map(this::toSmtp)
                .orElse(new SmtpConfigDTO(null, null, null, null, false));
    }

    private SmtpConfigDTO toSmtp(ConfiguracaoEntity c) {
        boolean configured = c.getEmailUsername() != null && !c.getEmailUsername().isBlank()
                && c.getEmailPassword() != null && !c.getEmailPassword().isBlank();
        return new SmtpConfigDTO(
                c.getEmailHost(), c.getEmailPort(), c.getEmailUsername(), c.getEmailPassword(), configured);
    }
}
