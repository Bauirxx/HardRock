import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useSiteConfig } from '@/lib/useSiteConfig';

const HORARIO_FALLBACK = [
    { dia: 'Seg – Sex', horas: '06h00 – 22h00' },
    { dia: 'Sábado', horas: '08h00 – 18h00' },
    { dia: 'Domingo', horas: '08h00 – 14h00' },
];

export default function MapSection() {
    const cfg = useSiteConfig();

    const endereco = cfg.endereco || 'Maputo, Moçambique';
    const telefone = cfg.whatsapp_number || cfg.telefone;
    const email = cfg.email_notificacao;
    const horarios = (Array.isArray(cfg.horarios) && cfg.horarios.length > 0) ? cfg.horarios : HORARIO_FALLBACK;
    const lat = parseFloat(cfg.latitude);
    const lng = parseFloat(cfg.longitude);
    const temCoords = !Number.isNaN(lat) && !Number.isNaN(lng);

    const infoItems = [
        { icon: MapPin, title: 'Endereço', lines: endereco.split(/,\s*/) },
        { icon: Clock, title: 'Horário', lines: horarios.map(h => `${h.dia}: ${h.horas}`) },
        { icon: Phone, title: 'Contacto', lines: [telefone, email].filter(Boolean) },
    ].filter(item => item.lines.length > 0);

    const mapsExternal = temCoords
        ? `https://www.google.com/maps?q=${lat},${lng}`
        : `https://maps.google.com/?q=${encodeURIComponent(endereco)}`;

    const osmEmbed = temCoords
        ? `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`
        : null;

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Localização</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2 mb-4">Onde nos encontrar</h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Vem conhecer as nossas instalações. Estamos à tua espera.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {infoItems.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="h-full hover:shadow-md transition-shadow">
                                <CardContent className="p-5 flex gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <item.icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold mb-1">{item.title}</p>
                                        {item.lines.map((line, j) => (
                                            <p key={j} className="text-sm text-muted-foreground">{line}</p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="rounded-2xl overflow-hidden border shadow-lg bg-muted"
                >
                    <div className="relative w-full h-80 sm:h-96 lg:h-[440px]">
                        {osmEmbed ? (
                            <iframe
                                src={osmEmbed}
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                className="w-full h-full"
                                title={`Localização ${cfg.nome || ''}`}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-center text-muted-foreground gap-2 p-6">
                                <MapPin className="w-10 h-10 opacity-30" />
                                <p className="text-sm">{endereco}</p>
                                <p className="text-xs">Defina a localização (latitude/longitude) nas Configurações para mostrar o mapa.</p>
                            </div>
                        )}
                        <div className="absolute bottom-4 right-4">
                            <a href={mapsExternal} target="_blank" rel="noopener noreferrer">
                                <Button size="sm" className="gap-2 shadow-lg">
                                    <Navigation className="w-4 h-4" />
                                    Abrir no Maps
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
