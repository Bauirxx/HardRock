const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async ({ to, subject, htmlContent }) => {
    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'geral@hardrockgym.com';
    const senderName = process.env.BREVO_SENDER_NAME || 'Hard Rock Gym';

    if (!apiKey || apiKey === 'coloca_aqui_a_tua_chave') {
        console.warn('⚠️ BREVO_API_KEY não configurada. Email não enviado.');
        return { success: false, error: 'API Key missing' };
    }

    try {
        const response = await fetch(BREVO_API_URL, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { name: senderName, email: senderEmail },
                to: [{ email: to }],
                subject: subject,
                htmlContent: htmlContent
            })
        });

        const result = await response.json();
        if (!response.ok) {
            console.error('❌ Erro Brevo API:', result);
            return { success: false, error: result };
        }

        console.log(`✅ Email enviado com sucesso para: ${to}`);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Template base para os emails do Hard Rock Gym
 */
const getBaseTemplate = (content) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Arial', sans-serif; background-color: #020617; color: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
        .header { background-color: #dc2626; padding: 30px; text-align: center; }
        .header h1 { margin: 0; color: #ffffff; text-transform: uppercase; letter-spacing: 2px; font-weight: 900; }
        .content { padding: 40px; line-height: 1.6; }
        .footer { padding: 20px; text-align: center; font-size: 12px; color: #64748b; background-color: #020617; }
        .button { display: inline-block; padding: 12px 24px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
        .highlight { color: #dc2626; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>HARD ROCK GYM</h1>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            &copy; 2026 Hard Rock Gym. Todos os direitos reservados.<br>
            Sente o poder. Domina o teu corpo.
        </div>
    </div>
</body>
</html>
`;

const emailService = {
    /**
     * Email de boas-vindas para novos membros (clientes internos)
     */
    sendWelcomeEmail: async (user) => {
        const html = getBaseTemplate(`
            <h2>Bem-vindo à Elite, ${user.nome}!</h2>
            <p>É com enorme satisfação que te recebemos como o mais novo membro do <span class="highlight">Hard Rock Gym</span>.</p>
            <p>O teu registo foi concluído com sucesso e agora tens acesso total às nossas instalações de ponta e planos personalizados.</p>
            <p>Podes aceder à tua área pessoal para consultar o teu estado e pagamentos:</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cliente" class="button">Aceder à minha Conta</a>
            <p style="margin-top: 30px;">Vemo-nos no ginásio!</p>
        `);

        return await sendEmail({
            to: user.email,
            subject: '🤘 Bem-vindo ao Hard Rock Gym!',
            htmlContent: html
        });
    },

    /**
     * Email de notificação de promoção (Externo -> Interno)
     */
    sendPromotionEmail: async (user) => {
        const html = getBaseTemplate(`
            <h2>Estás Promovido, ${user.full_name}!</h2>
            <p>Boas notícias! A tua conta no <span class="highlight">Hard Rock Gym</span> foi atualizada para <span class="highlight">Membro Interno</span>.</p>
            <p>Agora já podes usufruir de todos os serviços exclusivos, planos de musculação e acompanhamento profissional que temos para oferecer.</p>
            <p>O teu próximo desafio começa agora.</p>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/cliente" class="button">Ver meus Serviços</a>
        `);

        return await sendEmail({
            to: user.email,
            subject: '🏆 A tua conta foi promovida! - Hard Rock Gym',
            htmlContent: html
        });
    }
};

module.exports = emailService;
