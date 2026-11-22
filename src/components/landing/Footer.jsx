import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Clock, Phone, Mail, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useSiteConfig } from '@/lib/useSiteConfig';

// Inline X (Twitter) icon — Lucide has no official "X" yet.
function XIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M18.244 2H21.5l-7.5 8.571L23 22h-6.938l-5.47-6.727L4.4 22H1.144l8.021-9.171L1 2h7.094l4.943 6.214L18.244 2zm-1.214 18h1.878L7.034 4H5.046L17.03 20z" />
        </svg>
    );
}

const HORARIO_FALLBACK = [
    { dia: 'Seg - Sex', horas: '06h - 22h' },
    { dia: 'Sábado', horas: '08h - 18h' },
    { dia: 'Domingo', horas: '08h - 14h' },
];

function normalizarUrl(base, valor) {
    if (!valor) return null;
    if (valor.startsWith('http')) return valor;
    // aceita @handle ou username
    return base + valor.replace(/^@/, '');
}

export default function Footer() {
    const cfg = useSiteConfig();

    const nome = cfg.nome || 'Hard Rock Gym';
    const descricao = cfg.descricao
        || 'O seu parceiro na jornada de transformação física e mental. Equipamento de ponta e profissionais dedicados.';
    const telefone = cfg.whatsapp_number || cfg.telefone;
    const email = cfg.email_notificacao;
    const endereco = cfg.endereco;
    const horarios = (Array.isArray(cfg.horarios) && cfg.horarios.length > 0) ? cfg.horarios : HORARIO_FALLBACK;
    const redes = cfg.redes_sociais || {};

    const whatsappUrl = telefone
        ? `https://wa.me/${String(telefone).replace(/[^0-9]/g, '')}`
        : null;

    const socials = [
        whatsappUrl && { href: whatsappUrl, label: 'WhatsApp', Icon: MessageCircle },
        redes.facebook && { href: normalizarUrl('https://facebook.com/', redes.facebook), label: 'Facebook', Icon: Facebook },
        redes.instagram && { href: normalizarUrl('https://instagram.com/', redes.instagram), label: 'Instagram', Icon: Instagram },
        redes.youtube && { href: normalizarUrl('https://youtube.com/', redes.youtube), label: 'YouTube', Icon: Youtube },
        (redes.twitter || redes.x) && { href: normalizarUrl('https://x.com/', redes.twitter || redes.x), label: 'X', Icon: XIcon },
    ].filter(Boolean);

    return (
        <footer className="bg-sidebar text-sidebar-foreground">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/30">
                                <Dumbbell className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-space font-bold text-xl uppercase tracking-tighter italic">
                                {nome}
                            </span>
                        </div>
                        <p className="text-sm text-sidebar-foreground/70 leading-relaxed">{descricao}</p>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Links Rápidos</h4>
                        <div className="space-y-2 text-sm text-sidebar-foreground/70">
                            <Link to="/loja" className="block hover:text-primary transition-colors">Loja</Link>
                            <Link to="/ginasio" className="block hover:text-primary transition-colors">Ginásio</Link>
                            <Link to="/equipamentos" className="block hover:text-primary transition-colors">Equipamentos</Link>
                            <Link to="/cliente" className="block hover:text-primary transition-colors">Área do Cliente</Link>
                            <Link to="/rastreio" className="block hover:text-primary transition-colors">Rastreio de Encomenda</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Contacto</h4>
                        <div className="space-y-3 text-sm text-sidebar-foreground/70">
                            {endereco && (
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                                    <span>{endereco}</span>
                                </div>
                            )}
                            {telefone && (
                                <a href={whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Phone className="w-4 h-4 text-primary shrink-0" />
                                    <span>{telefone}</span>
                                </a>
                            )}
                            {email && (
                                <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                    <Mail className="w-4 h-4 text-primary shrink-0" />
                                    <span>{email}</span>
                                </a>
                            )}
                            {!endereco && !telefone && !email && (
                                <p className="text-sidebar-foreground/50">Configure os contactos nas Definições.</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Horário</h4>
                        <div className="flex items-start gap-2 text-sm text-sidebar-foreground/70">
                            <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <div>
                                {horarios.map((h, i) => (
                                    <p key={i}>{h.dia}{h.horas ? `: ${h.horas}` : ''}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-sidebar-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                        <p className="text-sm text-sidebar-foreground/50">
                            © {new Date().getFullYear()} {nome}. Todos os direitos reservados.
                        </p>
                        <p className="text-xs text-sidebar-foreground/40 mt-1">
                            Desenvolvido por <span className="text-primary font-medium">Arsénio Francisco Baquir</span>
                        </p>
                    </div>
                    {socials.length > 0 && (
                        <div className="flex items-center gap-3">
                            {socials.map(({ href, label, Icon }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label={label}
                                    className="w-9 h-9 rounded-full bg-sidebar-accent border border-sidebar-border flex items-center justify-center hover:bg-primary hover:border-primary hover:text-primary-foreground transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </footer>
    );
}
