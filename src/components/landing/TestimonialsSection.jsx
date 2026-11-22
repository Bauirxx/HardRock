import { useState, useEffect, useCallback } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import ScrollReveal from '@/components/ui/ScrollReveal';

export default function TestimonialsSection({ testimonials }) {
    const items = testimonials || [];
    const [current, setCurrent] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);

    const visibleCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : 3;
    const maxIndex = Math.max(0, items.length - visibleCount);

    const next = useCallback(() => setCurrent(c => Math.min(c + 1, maxIndex)), [maxIndex]);
    const prev = useCallback(() => setCurrent(c => Math.max(c - 1, 0)), []);

    useEffect(() => {
        if (items.length <= visibleCount) return;
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [items.length, visibleCount, next]);

    const handleTouchStart = (e) => { setIsDragging(true); setStartX(e.touches[0].clientX); };
    const handleTouchEnd = (e) => {
        if (!isDragging) return;
        const diff = startX - e.changedTouches[0].clientX;
        if (diff > 50) next();
        else if (diff < -50) prev();
        setIsDragging(false);
    };

    // Sem depoimentos reais → não mostrar a secção (sem mocks)
    if (items.length === 0) return null;

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Depoimentos</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2">
                        O que dizem os nossos membros
                    </h2>
                </ScrollReveal>

                <div className="relative">
                    {items.length > visibleCount && (
                        <>
                            <button onClick={prev} disabled={current === 0}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border shadow-lg hover:bg-muted transition-colors disabled:opacity-30"
                                aria-label="Anterior">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button onClick={next} disabled={current >= maxIndex}
                                className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-card border border-border shadow-lg hover:bg-muted transition-colors disabled:opacity-30"
                                aria-label="Próximo">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </>
                    )}

                    <div className="overflow-hidden" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                        <div
                            className="flex gap-6 transition-transform duration-500 ease-out"
                            style={{ transform: `translateX(-${current * (100 / visibleCount + 1.5)}%)` }}
                        >
                            {items.map((item, i) => (
                                <div key={i} className="flex-shrink-0" style={{ width: `calc(${100 / visibleCount}% - 1rem)` }}>
                                    <Card className="h-full card-lift border-border/50">
                                        <CardContent className="p-6 flex flex-col h-full">
                                            <Quote className="w-8 h-8 text-primary/20 mb-4" />
                                            <p className="text-muted-foreground flex-1 mb-6 italic">"{item.texto}"</p>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                        {item.nome?.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-semibold text-sm">{item.nome}</p>
                                                    <div className="flex gap-0.5">
                                                        {Array.from({ length: item.stars || 5 }).map((_, j) => (
                                                            <Star key={j} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dot indicators */}
                    {items.length > visibleCount && (
                        <div className="flex justify-center gap-2 mt-8">
                            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                                <button key={i} onClick={() => setCurrent(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                        i === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                                    }`}
                                    aria-label={`Ir para slide ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
