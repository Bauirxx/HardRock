import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Clock, Phone, Mail, Instagram, Facebook, MessageCircle } from 'lucide-react';

// Inline X (Twitter) icon — Lucide has no official "X" yet.
function XIcon(props) {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
            <path d="M18.244 2H21.5l-7.5 8.571L23 22h-6.938l-5.47-6.727L4.4 22H1.144l8.021-9.171L1 2h7.094l4.943 6.214L18.244 2zm-1.214 18h1.878L7.034 4H5.046L17.03 20z" />
        </svg>
    );
}

const CONTACTS = {
    whatsapp: '+258 84 000 0000',
    whatsappUrl: 'https://wa.me/258840000000',
    facebook: 'https://facebook.com/hardrockgym',
    instagram: 'https://instagram.com/hardrockgym',
    x: 'https://x.com/hardrockgym',
    email: 'info@hardrockgym.co.mz',
    address: 'Av. 24 de Julho, Maputo',
};

const socials = [
    { href: CONTACTS.whatsappUrl, label: 'WhatsApp', Icon: MessageCircle },
    { href: CONTACTS.facebook, label: 'Facebook', Icon: Facebook },
    { href: CONTACTS.instagram, label: 'Instagram', Icon: Instagram },
    { href: CONTACTS.x, label: 'X', Icon: XIcon },
];

export default function Footer() {
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
                                <span className="text-primary">Hard Rock</span>{' '}
                                <span>Gym</span>
                            </span>
                        </div>
                        <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
                            O seu parceiro na jornada de transformação física e mental.
                            Equipamento de ponta e profissionais dedicados.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Links Rápidos</h4>
                        <div className="space-y-2 text-sm text-sidebar-foreground/70">
                            <Link to="/loja" className="block hover:text-primary transition-colors">Loja</Link>
                            <Link to="/equipamentos" className="block hover:text-primary transition-colors">Equipamentos</Link>
                            <Link to="/cliente" className="block hover:text-primary transition-colors">Área do Cliente</Link>
                            <Link to="/rastreio" className="block hover:text-primary transition-colors">Rastreio de Encomenda</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Contacto</h4>
                        <div className="space-y-3 text-sm text-sidebar-foreground/70">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                <span>{CONTACTS.address}</span>
                            </div>
                            <a href={CONTACTS.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>{CONTACTS.whatsapp}</span>
                            </a>
                            <a href={`mailto:${CONTACTS.email}`} className="flex items-center gap-2 hover:text-primary transition-colors">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span>{CONTACTS.email}</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Horário</h4>
                        <div className="space-y-2 text-sm text-sidebar-foreground/70">
                            <div className="flex items-start gap-2">
                                <Clock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                <div>
                                    <p>Seg - Sex: 06h - 22h</p>
                                    <p>Sáb: 08h - 18h</p>
                                    <p>Dom: 08h - 14h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-sidebar-border mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-sidebar-foreground/50">
                        © {new Date().getFullYear()} Hard Rock Gym. Todos os direitos reservados.
                    </p>
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
                </div>
            </div>
        </footer>
    );
}
