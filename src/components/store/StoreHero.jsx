import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingBag, ChevronRight, Truck, ShieldCheck, Dumbbell } from 'lucide-react';

const HERO_BG = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1920&q=80&auto=format&fit=crop';

export default function StoreHero() {
    return (
        <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#0a0807]">
            <div className="absolute inset-0">
                <img
                    src={HERO_BG}
                    alt="Suplementos e equipamento de fitness"
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchpriority="high"
                    onError={e => { e.currentTarget.style.display = 'none'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                <div className="absolute -right-40 top-1/4 w-[500px] h-[500px] rounded-full bg-accent/15 blur-[140px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 mb-7 backdrop-blur-sm">
                        <ShoppingBag className="w-4 h-4 text-accent" />
                        <span className="text-white/80 text-sm font-medium">Entregas em todo o Maputo</span>
                    </div>

                    <h1 className="font-space font-bold text-white leading-[0.95] tracking-tight mb-6
                                   text-4xl sm:text-6xl lg:text-7xl">
                        Tudo para o teu
                        <span className="block text-gradient">treino e estilo</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/70 max-w-lg mb-10 leading-relaxed">
                        Suplementos, equipamento, acessórios e vestuário selecionados pela
                        <span className="text-white font-semibold"> LariusSport</span>. Qualidade
                        que acompanha os teus resultados.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/loja">
                            <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-xl shadow-lg shadow-primary/30">
                                <ShoppingBag className="w-5 h-5" />
                                Explorar loja
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link to="/ginasio">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base h-14 px-8 rounded-xl border-white/25 text-white hover:bg-white/10 bg-transparent">
                                <Dumbbell className="w-5 h-5" />
                                Conhecer o ginásio
                            </Button>
                        </Link>
                    </div>

                    {/* Selos de confiança */}
                    <div className="flex flex-wrap gap-x-8 gap-y-3 mt-12">
                        {[
                            { icon: Truck, texto: 'Entrega rápida' },
                            { icon: ShieldCheck, texto: 'Pagamento seguro' },
                            { icon: ShoppingBag, texto: 'Produtos originais' },
                        ].map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.texto} className="flex items-center gap-2 text-white/60">
                                    <Icon className="w-5 h-5 text-primary" />
                                    <span className="text-sm">{s.texto}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
