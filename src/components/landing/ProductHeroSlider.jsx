import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ChevronLeft, ChevronRight, Sparkles, ArrowRight, Dumbbell } from 'lucide-react';
import { addToCart } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';

// Slider "hero" de produtos: destaques, máquinas novas e adições recentes.
// Recebe a lista completa de produtos e escolhe os mais relevantes.
export default function ProductHeroSlider({ products = [] }) {
    const { toast } = useToast();
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);

    // Selecionar os produtos a mostrar: destaque primeiro, depois máquinas,
    // depois os mais recentes. Sem duplicados, no máximo 6.
    const slides = useMemo(() => {
        const byRecent = [...products].sort(
            (a, b) => new Date(b.created_date || 0) - new Date(a.created_date || 0)
        );
        const destaque = byRecent.filter(p => p.destaque);
        const maquinas = byRecent.filter(p => p.is_machine && !p.destaque);
        const recentes = byRecent.filter(p => !p.destaque && !p.is_machine);
        const ordered = [...destaque, ...maquinas, ...recentes];
        const seen = new Set();
        return ordered.filter(p => (seen.has(p.id) ? false : seen.add(p.id))).slice(0, 6);
    }, [products]);

    const go = useCallback((i) => {
        if (slides.length === 0) return;
        setCurrent((i + slides.length) % slides.length);
    }, [slides.length]);

    const next = useCallback(() => go(current + 1), [current, go]);
    const prev = useCallback(() => go(current - 1), [current, go]);

    // Auto-avanço
    useEffect(() => {
        if (paused || slides.length <= 1) return;
        const t = setInterval(() => setCurrent(c => (c + 1) % slides.length), 6000);
        return () => clearInterval(t);
    }, [paused, slides.length]);

    if (slides.length === 0) return null;

    const p = slides[current];
    const img = p.imagens?.[0] || p.imagem_url || p.image;
    const temPromo = p.preco_promocional && p.preco_promocional < p.preco;
    const desconto = temPromo ? Math.round((1 - p.preco_promocional / p.preco) * 100) : 0;

    const etiqueta = p.destaque
        ? { texto: 'Em Destaque', icon: Sparkles }
        : p.is_machine
        ? { texto: 'Nova Máquina', icon: Dumbbell }
        : { texto: 'Novidade', icon: Sparkles };
    const EtiquetaIcon = etiqueta.icon;

    const handleAdd = () => {
        addToCart(p);
        toast({ title: 'Adicionado ao carrinho', description: p.nome });
    };

    return (
        <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho da secção */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-10"
                >
                    <div>
                        <span className="text-primary text-sm font-semibold tracking-widest uppercase">Novidades & Destaques</span>
                        <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2">O melhor da nossa loja</h2>
                    </div>
                    <Link to="/loja">
                        <Button variant="ghost" className="gap-2 hidden sm:flex">
                            Ver loja <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </motion.div>

                {/* Palco do slider */}
                <div
                    className="relative rounded-3xl overflow-hidden border border-border/60 bg-gradient-to-br from-card to-muted/40 shadow-2xl"
                    onMouseEnter={() => setPaused(true)}
                    onMouseLeave={() => setPaused(false)}
                >
                    {/* Textura sutil */}
                    <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
                        style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, var(--tw-gradient-from), transparent 40%)' }} />

                    <div className="grid md:grid-cols-2 min-h-[420px] lg:min-h-[480px]">
                        {/* Lado do texto */}
                        <div className="relative z-10 flex flex-col justify-center p-8 sm:p-12 lg:p-16 order-2 md:order-1">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 24 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -24 }}
                                    transition={{ duration: 0.45, ease: 'easeOut' }}
                                >
                                    <div className="inline-flex items-center gap-2 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 mb-5">
                                        <EtiquetaIcon className="w-3.5 h-3.5 text-primary" />
                                        <span className="text-xs font-semibold text-primary uppercase tracking-wide">{etiqueta.texto}</span>
                                    </div>

                                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                                        {p.categoria || p.tipo || 'Produto'}
                                    </p>
                                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-space font-bold leading-tight mb-4 line-clamp-2">
                                        {p.nome}
                                    </h3>
                                    {p.descricao && (
                                        <p className="text-muted-foreground mb-6 max-w-md line-clamp-3">{p.descricao}</p>
                                    )}

                                    <div className="flex items-center gap-3 mb-8">
                                        {temPromo ? (
                                            <>
                                                <span className="text-3xl font-space font-bold text-primary">
                                                    {Number(p.preco_promocional).toLocaleString('pt-MZ')} MZN
                                                </span>
                                                <span className="text-lg text-muted-foreground line-through">
                                                    {Number(p.preco).toLocaleString('pt-MZ')}
                                                </span>
                                                <span className="rounded-md bg-destructive px-2 py-0.5 text-xs font-bold text-white">-{desconto}%</span>
                                            </>
                                        ) : p.sob_consulta ? (
                                            <span className="text-2xl font-space font-bold">Sob consulta</span>
                                        ) : (
                                            <span className="text-3xl font-space font-bold">
                                                {Number(p.preco || 0).toLocaleString('pt-MZ')} MZN
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <Link to={`/produto/${p.id}`}>
                                            <Button size="lg" className="gap-2 rounded-xl">
                                                Ver produto <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                        {!p.is_machine && !p.sob_consulta && (
                                            <Button size="lg" variant="outline" className="gap-2 rounded-xl" onClick={handleAdd}>
                                                <ShoppingCart className="w-4 h-4" /> Adicionar
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Lado da imagem */}
                        <div className="relative order-1 md:order-2 min-h-[240px] md:min-h-full overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, scale: 1.08 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.02 }}
                                    transition={{ duration: 0.6, ease: 'easeOut' }}
                                    className="absolute inset-0"
                                >
                                    {img ? (
                                        <img src={img} alt={p.nome} className="w-full h-full object-cover" loading="eager" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-muted">
                                            <ShoppingCart className="w-16 h-16 text-muted-foreground/30" />
                                        </div>
                                    )}
                                    {/* Gradiente para fundir com o lado do texto */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-card/80 via-transparent to-transparent hidden md:block" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent md:hidden" />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Setas */}
                    {slides.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                aria-label="Anterior"
                                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/70 backdrop-blur border border-border/60 hover:bg-background transition-colors"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={next}
                                aria-label="Seguinte"
                                className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-background/70 backdrop-blur border border-border/60 hover:bg-background transition-colors"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>

                            {/* Indicadores */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                                {slides.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => go(i)}
                                        aria-label={`Ir para o slide ${i + 1}`}
                                        className={`h-2 rounded-full transition-all ${i === current ? 'w-7 bg-primary' : 'w-2 bg-foreground/30 hover:bg-foreground/50'}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
