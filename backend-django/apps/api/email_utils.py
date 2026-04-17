from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings


def send_verification_email(user, code):
    """Send email verification code to new user during registration."""
    subject = 'Verifique o seu email — Hard Rock Gym'
    context = {
        'user_name': user.full_name or user.email,
        'code': code,
        'email': user.email,
    }
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
                <h2 style="color: #ef4444;">Hard Rock Gym — Verificação de Email</h2>
                <p>Olá {context['user_name']},</p>
                <p>Obrigado por se registar! Para activar a sua conta, use o código abaixo:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <h1 style="color: #10b981; letter-spacing: 5px; font-family: monospace;">{code}</h1>
                </div>
                <p>Este código expira em 24 horas.</p>
                <p style="color: #666; font-size: 12px;">Se não solicitou este email, ignore-o.</p>
            </div>
        </body>
    </html>
    """
    send_mail(subject, strip_tags(html_message), settings.DEFAULT_FROM_EMAIL,
              [user.email], html_message=html_message, fail_silently=True)


def send_welcome_email(user):
    """Send welcome email after account activation."""
    subject = 'Bem-vindo ao Hard Rock Gym!'
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
                <h2 style="color: #ef4444;">Bem-vindo ao Hard Rock Gym! 💪</h2>
                <p>Olá {user.full_name},</p>
                <p>A sua conta foi activada com sucesso!</p>
                <p>Pode agora:</p>
                <ul>
                    <li>Aceder à nossa loja online</li>
                    <li>Consultar o catálogo de máquinas</li>
                    <li>Contactar-nos para se tornar membro</li>
                </ul>
                <p style="margin-top: 30px; color: #666; font-size: 12px;">
                    Hard Rock Gym — Elite Training Center
                </p>
            </div>
        </body>
    </html>
    """
    send_mail(subject, strip_tags(html_message), settings.DEFAULT_FROM_EMAIL,
              [user.email], html_message=html_message, fail_silently=True)


def send_password_reset_email(user, token, reset_url):
    """Send password reset link to user."""
    subject = 'Redefina a sua senha — Hard Rock Gym'
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
                <h2 style="color: #ef4444;">Redefinição de Senha</h2>
                <p>Olá {user.full_name},</p>
                <p>Recebeu um pedido para redefinir a sua senha. Clique no link abaixo:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{reset_url}" style="background-color: #ef4444; color: white; padding: 12px 30px;
                       text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Redefinir Senha
                    </a>
                </div>
                <p>Ou copie este link:</p>
                <p style="word-break: break-all; color: #666; font-size: 12px;">{reset_url}</p>
                <p style="color: #ef4444; font-weight: bold;">⚠️ Este link expira em 24 horas.</p>
                <p style="color: #666; font-size: 12px;">Se não solicitou este email, ignore-o e nenhuma alteração será feita.</p>
            </div>
        </body>
    </html>
    """
    send_mail(subject, strip_tags(html_message), settings.DEFAULT_FROM_EMAIL,
              [user.email], html_message=html_message, fail_silently=True)


def send_invite_email(email, role, invite_url):
    """Send invite link to new staff/trainer/member."""
    role_display = {
        'admin': 'Administrador',
        'staff': 'Funcionário',
        'personal_trainer': 'Instrutor',
        'internal_client': 'Membro',
    }.get(role, role)

    subject = f'Você foi convidado para se juntar ao Hard Rock Gym como {role_display}'
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px;">
                <h2 style="color: #10b981;">Convite — Hard Rock Gym</h2>
                <p>Você foi convidado para se juntar ao Hard Rock Gym como <strong>{role_display}</strong>!</p>
                <p>Clique no link abaixo para aceitar o convite e criar a sua conta:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="{invite_url}" style="background-color: #10b981; color: white; padding: 12px 30px;
                       text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Aceitar Convite
                    </a>
                </div>
                <p style="color: #666; font-size: 12px;">Se tiver dúvidas, contacte-nos via WhatsApp.</p>
            </div>
        </body>
    </html>
    """
    send_mail(subject, strip_tags(html_message), settings.DEFAULT_FROM_EMAIL,
              [email], html_message=html_message, fail_silently=True)
