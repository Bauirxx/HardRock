import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Flame, CalendarCheck, ChevronRight, Dumbbell } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const HERO_BG = 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1920&q=80&auto=format&fit=crop';

export default function GymHero() {
    // Stats reais a partir de endpoints públicos (sem hardcode)
    const [stats, setStats] = useState([
        { valor: '—', rotulo: 'Treinadores' },
        { valor: '—', rotulo: 'Equipamentos' },
        { valor: '—', rotulo: 'Planos' },
        { valor: '24/7', rotulo: 'Acesso premium' },
    ]);

    const autenticado = (() => { try { return !!localStorage.getItem('auth_token'); } catch { return false; } })();

    useEffect(() => {
        Promise.all([
            base44.entities.Trainer.list('-created_date', 100).catch(() => []),
            base44.entities.Product.list('-created_date', 100).catch(() => []),
            base44.entities.Service.filter({ status: 'active' }).catch(() => []),
        ]).then(([trainers, produtos, servicos]) => {
            const equipamentos = (produtos || []).filter(p => p.is_machine).length;
            setStats([
                { valor: `${(trainers || []).length}`, rotulo: 'Treinadores' },
                { valor: `${equipamentos}`, rotulo: 'Equipamentos' },
                { valor: `${(servicos || []).length}`, rotulo: 'Planos' },
                { valor: '24/7', rotulo: 'Acesso premium' },
            ]);
        });
    }, []);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0a0807]">
            {/* Fundo */}
            <div className="absolute inset-0">
                <img
                    src={HERO_BG}
                    alt="Interior do ginásio Hard Rock"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
                {/* Brilho vermelho */}
                <div className="absolute -left-40 top-1/3 w-[520px] h-[520px] rounded-full bg-primary/20 blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-3xl"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 mb-7 backdrop-blur-sm">
                        <Flame className="w-4 h-4 text-primary" />
                        <span className="text-primary text-sm font-semibold tracking-wide">O ginásio nº1 de Maputo</span>
                    </div>

                    <h1 className="font-space font-bold text-white leading-[0.95] tracking-tight mb-6
                                   text-5xl sm:text-6xl lg:text-8xl">
                        DOMINE O
                        <span className="block text-gradient">SEU PODER</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
                        Equipamento de ponta, treinadores certificados e planos feitos para ti.
                        No <span className="text-white font-semibold">Hard Rock Gym</span> a tua
                        transformação começa hoje.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        {autenticado ? (
                            <Link to="/cliente">
                                <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-xl shadow-lg shadow-primary/30">
                                    <CalendarCheck className="w-5 h-5" />
                                    Área do Membro
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link to="/ginasio/inscricao">
                                <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-xl shadow-lg shadow-primary/30">
                                    <CalendarCheck className="w-5 h-5" />
                                    Quero inscrever-me
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        )}
                        <a href="#planos">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-xl border-white/25 text-white hover:bg-white/10 bg-transparent">
                                <Dumbbell className="w-5 h-5" />
                                Ver planos
                            </Button>
                        </a>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 max-w-2xl">
                        {stats.map((s, i) => (
                            <motion.div
                                key={s.rotulo}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                            >
                                <div className="text-3xl sm:text-4xl font-space font-bold text-white">{s.valor}</div>
                                <div className="text-xs sm:text-sm text-white/50 mt-1">{s.rotulo}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Indicador de scroll */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:flex flex-col items-center gap-2">
                <span className="text-white/40 text-xs uppercase tracking-widest">Descobre mais</span>
                <div className="w-5 h-9 rounded-full border-2 border-white/25 flex justify-center pt-1.5">
                    <motion.div
                        className="w-1 h-1.5 rounded-full bg-primary"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    />
                </div>
            </div>
        </section>
    );
}
