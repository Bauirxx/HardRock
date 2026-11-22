import { motion } from 'framer-motion';
import { Dumbbell, HeartPulse, Users, Clock, Trophy, ShieldCheck } from 'lucide-react';

const FEATURES = [
    { icon: Dumbbell, titulo: 'Equipamento de Ponta', texto: 'Máquinas de última geração e uma sala de pesos completa para todos os níveis.' },
    { icon: Users, titulo: 'Treinadores Certificados', texto: 'Personal trainers dedicados que criam planos à tua medida e te acompanham.' },
    { icon: HeartPulse, titulo: 'Aulas de Grupo', texto: 'Cardio, funcional e treino de força em grupo, com a energia que te faz voltar.' },
    { icon: Clock, titulo: 'Horário Alargado', texto: 'Abertos de segunda a sábado, cedo e até tarde, para treinares quando quiseres.' },
    { icon: Trophy, titulo: 'Resultados Reais', texto: 'Avaliações físicas e planos progressivos que transformam esforço em conquistas.' },
    { icon: ShieldCheck, titulo: 'Ambiente Seguro', texto: 'Espaço limpo, organizado e motivador, onde todos são bem-vindos.' },
];

export default function GymFeatures() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Porquê o Hard Rock</span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-space font-bold mt-2 mb-4">
                        Feito para quem leva a sério
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Tudo o que precisas para treinar melhor, num só lugar.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((f, i) => {
                        const Icon = f.icon;
                        return (
                            <motion.div
                                key={f.titulo}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className="group relative rounded-2xl border border-border/60 bg-card p-8 overflow-hidden card-lift"
                            >
                                <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                                <div className="relative">
                                    <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center mb-5 shadow-lg shadow-primary/20">
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="font-space font-bold text-xl mb-2">{f.titulo}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{f.texto}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
