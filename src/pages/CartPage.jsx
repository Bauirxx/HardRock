import { Link } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingBag, Minus, Plus, Trash2, ChevronLeft, ArrowRight } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
    const cart = useCart();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <Link to="/loja" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                            <ChevronLeft className="w-4 h-4" /> Continuar a comprar
                        </Link>
                        <h1 className="text-3xl font-space font-bold mb-8">Carrinho de Compras</h1>
                    </motion.div>

                    {cart.items.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
                            <ShoppingBag className="w-20 h-20 text-muted-foreground/20 mx-auto mb-4" />
                            <h2 className="text-xl font-space font-semibold mb-2">O seu carrinho está vazio</h2>
                            <p className="text-muted-foreground mb-6">Adicione produtos para começar.</p>
                            <Link to="/loja">
                                <Button className="gap-2">
                                    <ShoppingBag className="w-4 h-4" /> Ir à Loja
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                <AnimatePresence>
                                    {cart.items.map(item => (
                                        <motion.div
                                            key={item.product_id}
                                            layout
                                            exit={{ opacity: 0, x: -100 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <Card>
                                                <CardContent className="p-4 flex gap-4">
                                                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                                                        {item.imagem ? (
                                                            <img src={item.imagem} alt={item.nome} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <ShoppingBag className="w-6 h-6 text-muted-foreground/30" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold truncate">{item.nome}</h3>
                                                        <p className="text-sm text-primary font-medium">{item.preco.toLocaleString()} MZN</p>
                                                        <div className="flex items-center gap-2 mt-2">
                                                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => cart.updateQuantity(item.product_id, item.quantidade - 1)}>
                                                                <Minus className="w-3 h-3" />
                                                            </Button>
                                                            <span className="w-8 text-center text-sm font-medium">{item.quantidade}</span>
                                                            <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => cart.updateQuantity(item.product_id, item.quantidade + 1)}>
                                                                <Plus className="w-3 h-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end justify-between">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => cart.removeItem(item.product_id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                        <span className="font-bold text-sm">{(item.preco * item.quantidade).toLocaleString()} MZN</span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            <div>
                                <Card className="sticky top-24">
                                    <CardContent className="p-6">
                                        <h3 className="font-space font-semibold mb-4">Resumo</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Subtotal ({cart.count} itens)</span>
                                                <span>{cart.total.toLocaleString()} MZN</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Entrega</span>
                                                <span className="text-primary">Grátis</span>
                                            </div>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="flex justify-between font-bold text-lg mb-6">
                                            <span>Total</span>
                                            <span>{cart.total.toLocaleString()} MZN</span>
                                        </div>
                                        <Link to="/checkout">
                                            <Button className="w-full h-12 gap-2 text-base">
                                                Finalizar Compra <ArrowRight className="w-4 h-4" />
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}