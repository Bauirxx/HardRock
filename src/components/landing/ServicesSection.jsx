import { motion } from 'framer-motion';
import { Dumbbell, Heart, Zap, Users, Trophy, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const services = [
    { icon: Dumbbell, name: "Musculação", desc: "Equipamento de última geração para treino de força" },
    { icon: Zap, name: "CrossFit", desc: "Treinos funcionais de alta intensidade" },
    { icon: Heart, name: "Yoga & Pilates", desc: "Corpo e mente em equilíbrio" },
    { icon: Users, name: "Aulas de Grupo", desc: "Motivação e energia colectiva" },
    { icon: Trophy, name: "Personal Trainer", desc: "Acompanhamento personalizado" },
    { icon: Clock, name: "Cardio Zone", desc: "Passadeiras, bicicletas e elípticas" },
];

export default function ServicesSection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Serviços</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2 mb-4">
                        Tudo o que precisa num só lugar
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Oferecemos uma variedade completa de serviços para todos os níveis de fitness.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 border-border/50">
                                <CardContent className="p-6">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                        <service.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="font-space font-semibold text-lg mb-2">{service.name}</h3>
                                    <p className="text-muted-foreground text-sm">{service.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}