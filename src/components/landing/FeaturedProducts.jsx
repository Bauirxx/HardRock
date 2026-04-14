import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { addToCart } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';

export default function FeaturedProducts({ products = [] }) {
    const { toast } = useToast();

    const handleAdd = (product) => {
        addToCart(product);
        toast({ title: "Adicionado ao carrinho", description: product.nome });
    };

    if (products.length === 0) return null;

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex items-end justify-between mb-12"
                >
                    <div>
                        <span className="text-primary text-sm font-semibold tracking-widest uppercase">Loja</span>
                        <h2 className="text-3xl sm:text-4xl font-space font-bold mt-2">
                            Produtos em Destaque
                        </h2>
                    </div>
                    <Link to="/loja">
                        <Button variant="ghost" className="gap-2 hidden sm:flex">
                            Ver todos <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.slice(0, 4).map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="aspect-square relative overflow-hidden bg-muted">
                                    {product.imagens?.[0] ? (
                                        <img src={product.imagens[0]} alt={product.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                            <ShoppingCart className="w-12 h-12" />
                                        </div>
                                    )}
                                    {product.preco_promocional && (
                                        <Badge className="absolute top-3 left-3 bg-destructive">
                                            -{Math.round((1 - product.preco_promocional / product.preco) * 100)}%
                                        </Badge>
                                    )}
                                </div>
                                <CardContent className="p-4">
                                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.tipo}</p>
                                    <h3 className="font-semibold mb-2 line-clamp-1">{product.nome}</h3>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {product.preco_promocional ? (
                                                <>
                                                    <span className="font-bold text-primary">{product.preco_promocional.toLocaleString()} MZN</span>
                                                    <span className="text-sm text-muted-foreground line-through">{product.preco.toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold">{product.preco?.toLocaleString()} MZN</span>
                                            )}
                                        </div>
                                        <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => handleAdd(product)}>
                                            <ShoppingCart className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <Link to="/loja" className="sm:hidden">
                    <Button variant="outline" className="w-full mt-6 gap-2">
                        Ver todos os produtos <ArrowRight className="w-4 h-4" />
                    </Button>
                </Link>
            </div>
        </section>
    );
}