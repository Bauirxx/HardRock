import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Clock, CalendarCheck } from 'lucide-react';
import { useSiteConfig } from '@/lib/useSiteConfig';

const HORARIO_PADRAO = [
    { dia: 'Segunda a Sexta', horas: '06:00 — 22:00' },
    { dia: 'Sábado', horas: '08:00 — 20:00' },
    { dia: 'Domingo', horas: '08:00 — 13:00' },
];

export default function GymScheduleCTA({ horarios }) {
    const cfg = useSiteConfig();
    const HORARIO = (Array.isArray(horarios) && horarios.length > 0) ? horarios : HORARIO_PADRAO;
    const telefone = cfg.whatsapp_number || cfg.telefone;
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="relative rounded-3xl overflow-hidden bg-[#0a0807] border border-border/60">
                    {/* Brilho */}
                    <div className="absolute -right-32 -bottom-32 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[120px]" />
                    <div className="absolute -left-20 -top-20 w-[300px] h-[300px] rounded-full bg-accent/10 blur-[100px]" />

                    <div className="relative grid lg:grid-cols-2 gap-10 p-8 sm:p-12 lg:p-16">
                        {/* Horário */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 mb-6">
                                <Clock className="w-4 h-4 text-primary" />
                                <span className="text-white/80 text-sm font-medium">Horário de funcionamento</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-space font-bold text-white mb-8">
                                Estamos abertos quando precisas
                            </h2>
                            <div className="space-y-3">
                                {HORARIO.map(h => (
                                    <div key={h.dia} className="flex items-center justify-between border-b border-white/10 pb-3">
                                        <span className="text-white/70">{h.dia}</span>
                                        <span className="text-white font-space font-semibold">{h.horas}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col justify-center"
                        >
                            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-space font-bold text-white leading-tight mb-4">
                                Pronto para começar a tua <span className="text-gradient">transformação?</span>
                            </h3>
                            <p className="text-white/60 mb-8 max-w-md">
                                Agenda uma aula experimental gratuita e conhece as nossas instalações.
                                Sem compromisso, só resultados.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <a href="#lead-form">
                                    <Button size="lg" className="w-full sm:w-auto gap-2 h-14 px-8 rounded-xl text-base shadow-lg shadow-primary/30">
                                        <CalendarCheck className="w-5 h-5" />
                                        Agendar aula grátis
                                    </Button>
                                </a>
                                {telefone && (
                                    <a href={`tel:${String(telefone).replace(/\s/g, '')}`}>
                                        <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 rounded-xl text-base border-white/25 text-white hover:bg-white/10 bg-transparent">
                                            Ligar agora
                                        </Button>
                                    </a>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
