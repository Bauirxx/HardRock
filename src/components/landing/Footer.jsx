import { Link } from 'react-router-dom';
import { Dumbbell, MapPin, Clock, Phone, Mail, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-foreground text-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center border border-primary">
                                <Dumbbell className="w-5 h-5 text-primary" />
                            </div>
                            <span className="font-space font-bold text-xl uppercase tracking-tighter italic">
                                <span className="text-primary">Hard Rock</span>{' '}
                                <span>Gym</span>
                            </span>
                        </div>
                        <p className="text-sm text-background/60 leading-relaxed">
                            O seu parceiro na jornada de transformação física e mental.
                            Equipamento de ponta e profissionais dedicados.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Links Rápidos</h4>
                        <div className="space-y-2 text-sm text-background/60">
                            <Link to="/loja" className="block hover:text-primary transition-colors">Loja</Link>
                            <Link to="/equipamentos" className="block hover:text-primary transition-colors">Equipamentos</Link>
                            <Link to="/cliente" className="block hover:text-primary transition-colors">Área do Cliente</Link>
                            <Link to="/rastreio" className="block hover:text-primary transition-colors">Rastreio de Encomenda</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Contacto</h4>
                        <div className="space-y-3 text-sm text-background/60">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-primary shrink-0" />
                                <span>Av. 24 de Julho, Maputo</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary shrink-0" />
                                <span>+258 84 000 0000</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary shrink-0" />
                                <span>info@fitgym.co.mz</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-space font-semibold mb-4">Horário</h4>
                        <div className="space-y-2 text-sm text-background/60">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary shrink-0" />
                                <div>
                                    <p>Seg - Sex: 06h - 22h</p>
                                    <p>Sáb: 08h - 18h</p>
                                    <p>Dom: 08h - 14h</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-background/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-background/40">
                        © {new Date().getFullYear()} Lárius Sport. Todos os direitos reservados.
                    </p>
                    <div className="flex items-center gap-3">
                        <a href="#" className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                            <Instagram className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}