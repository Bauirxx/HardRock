import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { ShoppingBag, UserCheck, Dumbbell, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function HeroSection({ heroImage, slides = [] }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Use slides from props, or fallback to single heroImage
    const displaySlides = slides && slides.length > 0
        ? slides
        : heroImage
            ? [{ url: heroImage, titulo: 'Hard Rock Gym', link: '/loja', tipo: 'geral' }]
            : [];

    const currentHero = displaySlides[currentSlide] || {};

    // Auto-advance slides every 5 seconds
    useEffect(() => {
        if (displaySlides.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [displaySlides.length]);

    const goToSlide = (index) => {
        setCurrentSlide(index % displaySlides.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % displaySlides.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    };

    const handleSlideClick = () => {
        if (currentHero.link) {
            window.location.href = currentHero.link;
        }
    };

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Slide Background with transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0"
                >
                    <img
                        src={currentHero.url || heroImage}
                        alt={currentHero.titulo || 'Gym interior'}
                        className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-500"
                        onClick={handleSlideClick}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </motion.div>
            </AnimatePresence>
=======
import { ShoppingBag, UserCheck, Dumbbell, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection({ heroImage }) {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0">
                <img
                    src={heroImage}
                    alt="Gym interior"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-1.5 mb-6">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-primary text-sm font-medium">Aberto agora • Seg-Sex 6h-22h</span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-space font-bold text-white leading-tight mb-6">
                        Domine o seu poder no
                        <span className="block text-gradient"> Hard Rock Gym</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-white/70 mb-10 max-w-lg">
                        O melhor ginásio da cidade com equipamento de ponta,
                        instrutores certificados e planos personalizados.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to="/loja">
                            <Button size="lg" className="w-full sm:w-auto gap-2 text-base h-13 px-8 rounded-xl">
                                <ShoppingBag className="w-5 h-5" />
                                Loja de Produtos
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                        <Link to="/cliente">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 text-base h-13 px-8 rounded-xl border-white/20 text-white hover:bg-white/10">
                                <UserCheck className="w-5 h-5" />
                                Área do Cliente
                            </Button>
                        </Link>
                        <Link to="/equipamentos">
                            <Button size="lg" variant="ghost" className="w-full sm:w-auto gap-2 text-base h-13 px-8 rounded-xl text-white hover:bg-white/10">
                                <Dumbbell className="w-5 h-5" />
                                Equipamentos
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="flex flex-wrap gap-8 mt-16"
                >
                    {[
                        { number: "500+", label: "Membros Ativos" },
                        { number: "50+", label: "Equipamentos" },
                        { number: "15+", label: "Instrutores" },
                        { number: "98%", label: "Satisfação" },
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-space font-bold text-white">{stat.number}</div>
                            <div className="text-sm text-white/50">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
<<<<<<< HEAD

            {/* Slide Navigation */}
            {displaySlides.length > 1 && (
                <>
                    {/* Arrow buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                        {displaySlides.map((_, index) => (
                            <motion.button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentSlide ? 'bg-white' : 'bg-white/40'
                                }`}
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.9 }}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
=======
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
        </section>
    );
}