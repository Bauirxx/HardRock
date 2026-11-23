package com.gym.gym.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

/**
 * Verificação automática diária das subscrições:
 *  - avisa clientes cujo plano expira dentro de 3 dias (PLANO_EXPIRANDO)
 *  - marca como expirados os planos que passaram da data (PLANO_EXPIRADO)
 * Corre todos os dias às 08:00 (hora do servidor). Substitui o accionamento manual.
 */
@Component
public class SubscricaoScheduler {

    private static final Logger log = LoggerFactory.getLogger(SubscricaoScheduler.class);

    private final PlanoService planoService;

    public SubscricaoScheduler(PlanoService planoService) {
        this.planoService = planoService;
    }

    @Scheduled(cron = "0 0 8 * * *")
    public void verificacaoDiaria() {
        try {
            int aExpirar = planoService.verificarPlanosExpirando(3).size();
            int expirados = planoService.verificarEExpirarPlanos();
            log.info("[SCHEDULER] Verificação diária: {} a avisar, {} expirados", aExpirar, expirados);
        } catch (Exception e) {
            log.error("[SCHEDULER] Falha na verificação diária de subscrições: {}", e.getMessage());
        }
    }
}
