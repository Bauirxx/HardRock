package com.gym.notification.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class EmailTemplateService {

    @Value("${app.name:Hard Rock Gym}")
    private String appName;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    private String wrap(String title, String body) {
        return """
        <!DOCTYPE html>
        <html lang="pt">
        <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
        <body style="margin:0;padding:0;background:#111;font-family:'Helvetica Neue',Arial,sans-serif;">
        <table width="100%%" cellpadding="0" cellspacing="0" style="background:#111;padding:40px 20px;">
        <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#1a1a1a;border-radius:16px;overflow:hidden;max-width:600px;">
            <!-- Header -->
            <tr><td style="background:linear-gradient(135deg,#dc2626,#b91c1c);padding:32px 40px;text-align:center;">
                <h1 style="color:#fff;font-size:28px;margin:0;font-weight:800;letter-spacing:-0.5px;">%s</h1>
                <p style="color:rgba(255,255,255,0.7);font-size:12px;margin:8px 0 0;text-transform:uppercase;letter-spacing:2px;">%s</p>
            </td></tr>
            <!-- Body -->
            <tr><td style="padding:40px;">
                %s
            </td></tr>
            <!-- Footer -->
            <tr><td style="padding:24px 40px;border-top:1px solid #333;text-align:center;">
                <p style="color:#666;font-size:11px;margin:0;">%s &bull; Este email foi enviado automaticamente</p>
                <p style="color:#555;font-size:11px;margin:8px 0 0;">
                    <a href="%s" style="color:#dc2626;text-decoration:none;">Visitar o site</a>
                </p>
            </td></tr>
        </table>
        </td></tr>
        </table>
        </body>
        </html>
        """.formatted(title, appName, body, appName, frontendUrl);
    }

    private String button(String text, String url) {
        return """
        <table width="100%%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
        <tr><td align="center">
            <a href="%s" style="display:inline-block;background:#dc2626;color:#fff;padding:14px 32px;
            border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;">%s</a>
        </td></tr>
        </table>
        """.formatted(url, text);
    }

    private String p(String text) {
        return "<p style=\"color:#e0e0e0;font-size:15px;line-height:1.7;margin:0 0 16px;\">" + text + "</p>";
    }

    private String strong(String text) {
        return "<strong style=\"color:#fff;\">" + text + "</strong>";
    }

    // ─── 1. BOAS-VINDAS (criação de conta) ──────────────────────

    public String boasVindas(String nome, String email) {
        String body = p("Olá " + strong(nome) + ",")
            + p("A tua conta no " + strong(appName) + " foi criada com sucesso!")
            + p("Agora podes aceder à tua área pessoal, consultar os nossos serviços e fazer compras na loja.")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:10px;padding:20px;margin:20px 0;">
            <tr><td>
                <p style="color:#999;font-size:12px;margin:0 0 4px;text-transform:uppercase;">As tuas credenciais</p>
                <p style="color:#fff;font-size:14px;margin:0 0 8px;">Email: <strong>%s</strong></p>
                <p style="color:#999;font-size:12px;margin:0;">Password: a que definiste no registo</p>
            </td></tr>
            </table>
            """.formatted(email)
            + button("Aceder à Minha Conta", frontendUrl + "/login")
            + p("Estamos prontos para te ajudar a atingir os teus objectivos!");

        return wrap("Bem-vindo!", body);
    }

    // ─── 2. VERIFICAÇÃO DE EMAIL ────────────────────────────────

    public String verificacaoEmail(String nome, String codigo) {
        String body = p("Olá " + strong(nome) + ",")
            + p("Usa o código abaixo para verificar o teu email:")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td align="center">
                <div style="background:#222;border:2px dashed #dc2626;border-radius:12px;padding:20px 40px;display:inline-block;">
                    <span style="font-size:36px;font-weight:800;letter-spacing:8px;color:#fff;">%s</span>
                </div>
            </td></tr>
            </table>
            """.formatted(codigo)
            + p("Este código expira em " + strong("15 minutos") + ".")
            + p("Se não solicitaste esta verificação, ignora este email.");

        return wrap("Verificação de Email", body);
    }

    // ─── 3. RECUPERAÇÃO DE SENHA ────────────────────────────────

    public String recuperacaoSenha(String nome, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String body = p("Olá " + strong(nome) + ",")
            + p("Recebemos um pedido para redefinir a tua password.")
            + button("Redefinir Password", resetUrl)
            + p("Ou copia este link no teu navegador:")
            + "<p style=\"color:#dc2626;font-size:12px;word-break:break-all;margin:0 0 16px;\">" + resetUrl + "</p>"
            + p("Este link expira em " + strong("1 hora") + ".")
            + p("Se não fizeste este pedido, ignora este email — a tua conta está segura.");

        return wrap("Recuperação de Password", body);
    }

    // ─── 4. SENHA REDEFINIDA COM SUCESSO ────────────────────────

    public String senhaRedefinida(String nome) {
        String body = p("Olá " + strong(nome) + ",")
            + p("A tua password foi redefinida com " + strong("sucesso") + ".")
            + p("Se não foste tu a fazer esta alteração, contacta-nos imediatamente.")
            + button("Iniciar Sessão", frontendUrl + "/login");

        return wrap("Password Alterada", body);
    }

    // ─── 5. PLANO ACTIVADO / SUBSCRIÇÃO ─────────────────────────

    public String planoActivado(String nome, String servico, String dataInicio, String dataFim, String valor, String trainerNome) {
        String trainerRow = trainerNome != null
            ? "<tr><td style=\"color:#999;padding:6px 0;\">Personal Trainer</td><td style=\"color:#fff;padding:6px 0;font-weight:600;\">" + trainerNome + "</td></tr>"
            : "";

        String body = p("Olá " + strong(nome) + ",")
            + p("A tua subscrição foi activada com sucesso!")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #22c55e;">
            <tr><td style="color:#999;padding:6px 0;">Serviço</td><td style="color:#fff;padding:6px 0;font-weight:600;">%s</td></tr>
            <tr><td style="color:#999;padding:6px 0;">Período</td><td style="color:#fff;padding:6px 0;font-weight:600;">%s a %s</td></tr>
            <tr><td style="color:#999;padding:6px 0;">Valor</td><td style="color:#22c55e;padding:6px 0;font-weight:700;font-size:18px;">%s MT</td></tr>
            %s
            </table>
            """.formatted(servico, dataInicio, dataFim, valor, trainerRow)
            + button("Ver o Meu Plano", frontendUrl + "/cliente")
            + p("Bons treinos!");

        return wrap("Subscrição Activada", body);
    }

    // ─── 6. AVISO DE VENCIMENTO (3 dias antes) ──────────────────

    public String avisoVencimento(String nome, String servico, String dataFim, int diasRestantes) {
        String urgencia = diasRestantes <= 1
            ? "<span style=\"color:#ef4444;font-weight:700;\">AMANHÃ</span>"
            : "em <strong style=\"color:#f59e0b;\">" + diasRestantes + " dias</strong>";

        String body = p("Olá " + strong(nome) + ",")
            + p("O teu plano de " + strong(servico) + " expira " + urgencia + " (" + strong(dataFim) + ").")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #f59e0b;">
            <tr><td>
                <p style="color:#f59e0b;font-size:14px;font-weight:700;margin:0 0 8px;">⚠ Atenção</p>
                <p style="color:#e0e0e0;font-size:14px;margin:0;">Após o vencimento, perderás acesso ao serviço. Renova já para continuares a treinar sem interrupções.</p>
            </td></tr>
            </table>
            """
            + button("Renovar Agora", frontendUrl + "/cliente")
            + p("Obrigado por treinares connosco!");

        return wrap("Plano a Expirar", body);
    }

    // ─── 7. PLANO EXPIRADO ──────────────────────────────────────

    public String planoExpirado(String nome, String servico, String dataFim) {
        String body = p("Olá " + strong(nome) + ",")
            + p("O teu plano de " + strong(servico) + " expirou em " + strong(dataFim) + ".")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #ef4444;">
            <tr><td>
                <p style="color:#ef4444;font-size:14px;font-weight:700;margin:0 0 8px;">Plano Inactivo</p>
                <p style="color:#e0e0e0;font-size:14px;margin:0;">O teu acesso ao serviço foi suspenso. Renova para voltar a treinar.</p>
            </td></tr>
            </table>
            """
            + button("Renovar Plano", frontendUrl + "/cliente")
            + p("Sentimos a tua falta — volta já!");

        return wrap("Plano Expirado", body);
    }

    // ─── 8. PLANO CANCELADO ─────────────────────────────────────

    public String planoCancelado(String nome, String servico) {
        String body = p("Olá " + strong(nome) + ",")
            + p("O teu plano de " + strong(servico) + " foi cancelado.")
            + p("Se isto foi um erro ou precisas de ajuda, contacta a recepção do ginásio.")
            + button("Contactar", frontendUrl);

        return wrap("Plano Cancelado", body);
    }

    // ─── 9. CONFIRMAÇÃO DE COMPRA ───────────────────────────────

    public String confirmacaoCompra(String nome, String resumoItens, String valorTotal) {
        String body = p("Olá " + strong(nome) + ",")
            + p("A tua compra foi confirmada com sucesso!")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:10px;padding:20px;margin:20px 0;">
            <tr><td>
                <p style="color:#999;font-size:12px;margin:0 0 12px;text-transform:uppercase;">Resumo da Compra</p>
                %s
                <hr style="border:none;border-top:1px solid #333;margin:16px 0;">
                <table width="100%%"><tr>
                    <td style="color:#999;font-size:14px;">Total</td>
                    <td style="color:#22c55e;font-size:22px;font-weight:800;text-align:right;">%s MT</td>
                </tr></table>
            </td></tr>
            </table>
            """.formatted(resumoItens, valorTotal)
            + button("Ver as Minhas Compras", frontendUrl + "/cliente")
            + p("Obrigado pela tua compra!");

        return wrap("Compra Confirmada", body);
    }

    // ─── 10. PT — NOVO CLIENTE ALOCADO ──────────────────────────

    public String novoClienteAlocado(String nomePt, String nomeCliente, String servico, String dataFim) {
        String body = p("Olá " + strong(nomePt) + ",")
            + p("Um novo cliente foi alocado a ti!")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #3b82f6;">
            <tr><td style="color:#999;padding:6px 0;">Cliente</td><td style="color:#fff;padding:6px 0;font-weight:600;">%s</td></tr>
            <tr><td style="color:#999;padding:6px 0;">Serviço</td><td style="color:#fff;padding:6px 0;font-weight:600;">%s</td></tr>
            <tr><td style="color:#999;padding:6px 0;">Válido até</td><td style="color:#fff;padding:6px 0;font-weight:600;">%s</td></tr>
            </table>
            """.formatted(nomeCliente, servico, dataFim)
            + button("Ver os Meus Clientes", frontendUrl + "/trainer")
            + p("Bom trabalho!");

        return wrap("Novo Cliente Alocado", body);
    }

    // ─── 11. PAGAMENTO EM ATRASO ────────────────────────────────

    public String pagamentoEmAtraso(String nome, String servico, String valorDevido, String dataVencimento) {
        String body = p("Olá " + strong(nome) + ",")
            + p("Detectámos que tens um pagamento em atraso.")
            + """
            <table width="100%%" cellpadding="0" cellspacing="0" style="background:#222;border-radius:10px;padding:20px;margin:20px 0;border-left:4px solid #ef4444;">
            <tr><td style="color:#999;padding:6px 0;">Serviço</td><td style="color:#fff;padding:6px 0;font-weight:600;">%s</td></tr>
            <tr><td style="color:#999;padding:6px 0;">Valor</td><td style="color:#ef4444;padding:6px 0;font-weight:700;font-size:18px;">%s MT</td></tr>
            <tr><td style="color:#999;padding:6px 0;">Vencimento</td><td style="color:#fff;padding:6px 0;font-weight:600;">%s</td></tr>
            </table>
            """.formatted(servico, valorDevido, dataVencimento)
            + p("Por favor regulariza o pagamento o mais rapidamente possível para evitar a suspensão do teu plano.")
            + button("Regularizar Pagamento", frontendUrl + "/cliente")
            + p("Se já efectuaste o pagamento, ignora este email.");

        return wrap("Pagamento em Atraso", body);
    }

    // ─── 12. CONVITE PARA O GINÁSIO ─────────────────────────────

    public String convite(String nomeConvidado, String emailConvidado, String role, String inviteToken) {
        String roleLabel = switch (role) {
            case "DONO_DO_GINASIO" -> "Gestor do Ginásio";
            case "SUPER_USER" -> "Administrador";
            default -> "Membro";
        };
        String registerUrl = frontendUrl + "/registo?invite=" + inviteToken + "&email=" + emailConvidado;

        String body = p("Olá " + strong(nomeConvidado) + ",")
            + p("Foste convidado para juntar-te ao " + strong(appName) + " como " + strong(roleLabel) + ".")
            + button("Aceitar Convite", registerUrl)
            + p("Este convite expira em " + strong("7 dias") + ".")
            + p("Se não reconheces este convite, ignora este email.");

        return wrap("Convite — " + appName, body);
    }
}
