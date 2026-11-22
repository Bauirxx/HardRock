import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dumbbell, ArrowRight, Flame } from 'lucide-react';

const BG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1600&q=80&auto=format&fit=crop';

// Banner na loja (LariusSport) que promove o ginásio (Hard Rock).
export default function GymCrossPromo() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative rounded-3xl overflow-hidden min-h-[360px] flex items-center border border-border/60"
                >
                    <img src={BG} alt="Ginásio Hard Rock" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
                    <div className="absolute -left-24 -bottom-24 w-[360px] h-[360px] rounded-full bg-primary/25 blur-[120px]" />

                    <div className="relative z-10 p-8 sm:p-12 lg:p-16 max-w-2xl">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/15 px-4 py-1.5 mb-5 backdrop-blur-sm">
                            <Flame className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-semibold">Hard Rock Gym</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-space font-bold text-white leading-tight mb-4">
                            Mais do que uma loja.<br />Um <span className="text-gradient">ginásio completo.</span>
                        </h2>
                        <p className="text-white/70 text-lg mb-8 max-w-lg">
                            Planos de treino, personal trainers e instalações de topo. Conhece o
                            lado ginásio da nossa marca e agenda uma aula experimental grátis.
                        </p>
                        <Link to="/ginasio">
                            <Button size="lg" className="gap-2 h-14 px-8 rounded-xl text-base shadow-lg shadow-primary/30">
                                <Dumbbell className="w-5 h-5" />
                                Descobrir o ginásio
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
