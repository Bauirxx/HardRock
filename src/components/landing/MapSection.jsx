import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const INFO_ITEMS = [
    {
        icon: MapPin,
        title: "Endereço",
        lines: ["Av. 24 de Julho, Nº 1234", "Maputo, Moçambique"],
    },
    {
        icon: Clock,
        title: "Horário",
        lines: ["Seg – Sex: 06h00 – 22h00", "Sáb: 08h00 – 18h00", "Dom: 08h00 – 14h00"],
    },
    {
        icon: Phone,
        title: "Contacto",
        lines: ["+258 84 000 0000", "info@fitgym.co.mz"],
    },
];

const MAPS_URL = "https://maps.google.com/?q=Maputo+Mozambique+Avenida+24+de+Julho";
const MAPS_EMBED = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.5!2d32.5!3d-25.9!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDU0JzAwLjAiUyAzMsKwMzAnMDAuMCJF!5e0!3m2!1sen!2smz!4v1`;

export default function MapSection() {
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
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2 mb-4">
                        Onde nos encontrar
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Estamos localizados no coração de Maputo, de fácil acesso por transporte público e com estacionamento gratuito.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {INFO_ITEMS.map((item, i) => (
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
                        <iframe
                            src={MAPS_EMBED}
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                            title="Localização FitGym"
                        />
                        <div className="absolute bottom-4 right-4">
                            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
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