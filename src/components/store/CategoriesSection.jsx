import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pill, Dumbbell, ShoppingBag, Shirt, ArrowRight } from 'lucide-react';

const CATEGORIAS = [
    { value: 'SUPLEMENTO', label: 'Suplementos', desc: 'Proteínas, creatina e mais', icon: Pill, img: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&q=80&auto=format&fit=crop' },
    { value: 'EQUIPAMENTO', label: 'Equipamentos', desc: 'Máquinas e pesos', icon: Dumbbell, img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80&auto=format&fit=crop' },
    { value: 'ACESSORIO', label: 'Acessórios', desc: 'Luvas, cintos, shakers', icon: ShoppingBag, img: 'https://images.unsplash.com/photo-1583473848882-f9a5bc7fd2ee?w=600&q=80&auto=format&fit=crop' },
    { value: 'VESTUARIO', label: 'Vestuário', desc: 'Roupa de treino', icon: Shirt, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80&auto=format&fit=crop' },
];

export default function CategoriesSection() {
    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <span className="text-primary text-sm font-semibold tracking-widest uppercase">Categorias</span>
                    <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2">Compra por categoria</h2>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {CATEGORIAS.map((c, i) => {
                        const Icon = c.icon;
                        return (
                            <motion.div
                                key={c.value}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                            >
                                <Link
                                    to={`/loja?categoria=${c.value}`}
                                    className="group relative block aspect-[4/5] rounded-2xl overflow-hidden border border-border/60"
                                >
                                    <img
                                        src={c.img}
                                        alt={c.label}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                    <div className="absolute inset-0 p-5 flex flex-col justify-end">
                                        <div className="w-11 h-11 rounded-xl bg-primary/90 flex items-center justify-center mb-3 shadow-lg">
                                            <Icon className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="font-space font-bold text-white text-lg">{c.label}</h3>
                                        <p className="text-white/60 text-xs mb-2">{c.desc}</p>
                                        <span className="inline-flex items-center gap-1 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                            Ver <ArrowRight className="w-3.5 h-3.5" />
                                        </span>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
