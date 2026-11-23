import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import { base44 } from '@/api/base44Client';

// Fallback usado só se a API não devolver nada (ex: BD vazia ou offline)
const FALLBACK = [
    {
        nome: 'Ricardo M.',
        antes: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=500&fit=crop',
        depois: 'https://images.unsplash.com/photo-1534367610401-9f5ed68180aa?w=400&h=500&fit=crop',
        tempo: '6 meses',
        resultado: 'Perdeu 20kg e ganhou massa muscular',
    },
    {
        nome: 'Carla S.',
        antes: 'https://images.unsplash.com/photo-1518310952931-b1de897abd40?w=400&h=500&fit=crop',
        depois: 'https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&h=500&fit=crop',
        tempo: '4 meses',
        resultado: 'Transformação completa com treino personalizado',
    },
    {
        nome: 'André P.',
        antes: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=500&fit=crop',
        depois: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&h=500&fit=crop',
        tempo: '8 meses',
        resultado: 'De sedentário a atleta — ganho de 12kg de músculo',
    },
];

export default function TransformationsSection() {
    const [transformations, setTransformations] = useState(FALLBACK);
    const [current, setCurrent] = useState(0);
    const [sliderPos, setSliderPos] = useState(50);

    useEffect(() => {
        let mounted = true;
        base44.entities.Transformation.list('ordem', 50)
            .then(data => {
                if (mounted && Array.isArray(data) && data.length > 0) {
                    setTransformations(data);
                    setCurrent(0);
                }
            })
            .catch(() => { /* mantém o FALLBACK */ });
        return () => { mounted = false; };
    }, []);

    const total = transformations.length;
    const next = useCallback(() => setCurrent(c => (c + 1) % total), [total]);
    const prev = useCallback(() => setCurrent(c => (c - 1 + total) % total), [total]);

    useEffect(() => {
        if (total <= 1) return;
        const timer = setInterval(next, 6000);
        return () => clearInterval(timer);
    }, [next, total]);

    const t = transformations[current] || transformations[0];
    if (!t) return null;

    const handleSliderMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const pos = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        setSliderPos(pos);
    };

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <ScrollReveal className="text-center mb-16">
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Transformações</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2 mb-4">
                        Histórias Reais de Sucesso
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Vê as transformações dos nossos membros. O próximo podes ser tu.
                    </p>
                </ScrollReveal>

                <ScrollReveal>
                    <div className="relative">
                        {/* Before/After slider */}
                        <div
                            className="relative aspect-[3/2] sm:aspect-[2/1] rounded-2xl overflow-hidden cursor-col-resize select-none"
                            onMouseMove={handleSliderMove}
                            onTouchMove={handleSliderMove}
                        >
                            {/* After (full background) */}
                            <img
                                src={t.depois}
                                alt={`${t.nome} — Depois`}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover"
                            />

                            {/* Before (clipped) */}
                            <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
                                <img
                                    src={t.antes}
                                    alt={`${t.nome} — Antes`}
                                    loading="lazy"
                                    className="absolute inset-0 w-full h-full object-cover grayscale"
                                    style={{ width: `${(100 / sliderPos) * 100}%`, maxWidth: 'none' }}
                                />
                            </div>

                            {/* Slider handle */}
                            <div
                                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
                                style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
                            >
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white shadow-xl flex items-center justify-center">
                                    <ChevronLeft className="w-4 h-4 text-black" />
                                    <ChevronRight className="w-4 h-4 text-black" />
                                </div>
                            </div>

                            {/* Labels */}
                            <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                                Antes
                            </div>
                            <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase">
                                Depois
                            </div>
                        </div>

                        {/* Info bar */}
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-center sm:text-left">
                                <h3 className="font-space font-bold text-xl">{t.nome}</h3>
                                <p className="text-muted-foreground text-sm">{t.resultado}</p>
                                <span className="text-primary text-sm font-semibold">{t.tempo}</span>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={prev}
                                    className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                                    aria-label="Transformação anterior">
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button onClick={next}
                                    className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
                                    aria-label="Próxima transformação">
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Dots */}
                        <div className="flex justify-center gap-2 mt-4">
                            {transformations.map((_, i) => (
                                <button key={i} onClick={() => setCurrent(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                                        i === current ? 'bg-primary w-6' : 'bg-muted-foreground/30'
                                    }`}
                                    aria-label={`Transformação ${i + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </section>
    );
}
