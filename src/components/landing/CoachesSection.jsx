import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { User, Award, Users } from 'lucide-react';

export default function CoachesSection() {
    const [trainers, setTrainers] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        base44.entities.Trainer.list('-created_date', 20)
            .then(pts => {
                setTrainers((pts || []).filter(t => t.status !== 'inactive').slice(0, 6));
            })
            .catch(() => {})
            .finally(() => setLoaded(true));
    }, []);

    if (loaded && trainers.length === 0) return null;

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/30">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">A Nossa Equipa</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2 mb-4">
                        Coaches de Excelência
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Profissionais certificados prontos para te guiar na tua transformação.
                    </p>
                </ScrollReveal>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {!loaded && [1, 2, 3].map(i => (
                        <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
                    ))}

                    {trainers.map((coach, i) => (
                        <ScrollReveal key={coach.id} delay={i * 100}>
                            <div className="flip-card aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer group">
                                <div className="flip-card-inner w-full h-full relative">
                                    {/* Front — photo + name */}
                                    <div className="flip-card-front w-full h-full">
                                        <div className="w-full h-full bg-gradient-to-b from-muted/50 to-muted flex flex-col items-center justify-center relative">
                                            {coach.foto_url ? (
                                                <img
                                                    src={coach.foto_url}
                                                    alt={coach.full_name}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="w-12 h-12 text-primary" />
                                                </div>
                                            )}
                                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                                                <h3 className="font-space font-bold text-white text-xl">{coach.full_name}</h3>
                                                <p className="text-white/60 text-sm">{coach.especialidade || 'Personal Trainer'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Back — bio + certifications */}
                                    <div className="flip-card-back w-full h-full bg-card border border-border rounded-2xl p-6 flex flex-col justify-center">
                                        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                                            <Award className="w-7 h-7 text-primary" />
                                        </div>
                                        <h3 className="font-space font-bold text-center text-lg mb-2">{coach.full_name}</h3>
                                        <p className="text-muted-foreground text-sm text-center mb-4">
                                            {coach.bio || 'Profissional dedicado ao teu sucesso no treino.'}
                                        </p>
                                        {coach.especialidade && (
                                            <p className="text-xs text-center text-primary font-medium mb-3">
                                                {coach.especialidade}
                                            </p>
                                        )}
                                        {coach.clientes_activos != null && (
                                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                <Users className="w-4 h-4" />
                                                <span>{coach.clientes_activos} clientes activos</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
