import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { base44 } from '@/api/base44Client';

export default function ServicesSection() {
    const [apiServices, setApiServices] = useState([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        base44.entities.Service.filter({ status: 'active' })
            .then(data => { setApiServices(data || []); })
            .catch(() => {})
            .finally(() => setLoaded(true));
    }, []);

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Planos & Serviços</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2 mb-4">
                        Tudo o que precisa num só lugar
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Oferecemos uma variedade completa de serviços para todos os níveis de fitness.
                    </p>
                </motion.div>

                {!loaded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="rounded-xl border border-border/50 bg-muted/30 animate-pulse h-48" />
                        ))}
                    </div>
                )}

                {loaded && apiServices.length === 0 && null}

                {loaded && apiServices.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {apiServices.map((s, i) => (
                        <motion.div
                            key={s.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1 border-border/50 overflow-hidden">
                                <div className="h-1" style={{ backgroundColor: s.cor || '#10B981' }} />
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:opacity-80 transition-colors"
                                            style={{ backgroundColor: `${s.cor || '#10B981'}20` }}>
                                            <Dumbbell className="w-6 h-6" style={{ color: s.cor || '#10B981' }} />
                                        </div>
                                        {s.inclui_pt && (
                                            <span className="text-xs px-2 py-1 rounded-full font-medium"
                                                style={{ backgroundColor: `${s.cor || '#10B981'}20`, color: s.cor || '#10B981' }}>
                                                +PT
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-space font-semibold text-lg mb-1">{s.nome}</h3>
                                    {s.descricao && <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{s.descricao}</p>}
                                    {Array.isArray(s.beneficios) && s.beneficios.slice(0, 3).map((b, bi) => (
                                        <div key={bi} className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                                            <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                                            {b}
                                        </div>
                                    ))}
                                    {s.preco_mensal > 0 && (
                                        <p className="font-bold text-xl mt-3" style={{ color: s.cor || '#10B981' }}>
                                            {Number(s.preco_mensal).toLocaleString('pt-MZ')} <span className="text-sm font-normal text-muted-foreground">MZN/mês</span>
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
                )}
            </div>
        </section>
    );
}
