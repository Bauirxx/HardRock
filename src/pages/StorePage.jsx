import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import WhatsAppButton from '../components/landing/WhatsAppButton';
import ProductCard from '../components/store/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
    { value: 'all', label: 'Todos' },
    { value: 'supplement', label: 'Suplementos' },
    { value: 'clothing', label: 'Roupas' },
    { value: 'accessory', label: 'Acessórios' },
];

export default function StorePage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    useEffect(() => {
        base44.entities.Product.filter({ status: 'active', is_machine: false })
            .then(setProducts)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = products.filter(p => {
        const matchSearch = p.nome?.toLowerCase().includes(search.toLowerCase());
        const matchCat = category === 'all' || p.tipo === category;
        return matchSearch && matchCat;
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-space font-bold mb-2">Loja</h1>
                        <p className="text-muted-foreground">Suplementos, roupas e acessórios para o seu treino</p>
                    </motion.div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                placeholder="Procurar produtos..."
                                className="pl-10"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {CATEGORIES.map(cat => (
                                <Button
                                    key={cat.value}
                                    variant={category === cat.value ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setCategory(cat.value)}
                                >
                                    {cat.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Products Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="rounded-xl bg-muted animate-pulse aspect-[3/4]" />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24">
                            <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="font-space font-semibold text-lg mb-2">Nenhum produto encontrado</h3>
                            <p className="text-muted-foreground">Tente ajustar os filtros de pesquisa.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}