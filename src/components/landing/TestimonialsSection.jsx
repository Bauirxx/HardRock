import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const fallbackTestimonials = [
    { nome: "Maria S.", texto: "O melhor ginásio que já frequentei! Equipamentos modernos e instrutores fantásticos.", stars: 5 },
    { nome: "João P.", texto: "Perdi 15kg em 6 meses com o acompanhamento personalizado. Recomendo a 100%!", stars: 5 },
    { nome: "Ana L.", texto: "As aulas de yoga mudaram a minha vida. Ambiente incrível e equipa atenciosa.", stars: 5 },
];

export default function TestimonialsSection({ testimonials }) {
    const items = testimonials?.length > 0 ? testimonials : fallbackTestimonials;

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Depoimentos</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2">
                        O que dizem os nossos membros
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {items.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.15 }}
                        >
                            <Card className="h-full hover:shadow-lg transition-shadow">
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
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}