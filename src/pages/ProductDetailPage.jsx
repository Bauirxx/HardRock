import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Minus, Plus, ChevronLeft, Package, Shield, Truck } from 'lucide-react';
import { addToCart } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState(0);
    const { toast } = useToast();

    useEffect(() => {
        base44.entities.Product.filter({ id })
            .then(items => setProduct(items[0]))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAdd = () => {
        addToCart(product, quantity);
        toast({ title: "Adicionado ao carrinho", description: `${quantity}x ${product.nome}` });
    };

    if (loading) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="pt-24 max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="aspect-square bg-muted rounded-2xl animate-pulse" />
                        <div className="space-y-4">
                            <div className="h-8 bg-muted rounded w-3/4 animate-pulse" />
                            <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
                            <div className="h-24 bg-muted rounded animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="pt-32 text-center">
                    <Package className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Produto não encontrado</h2>
                    <Link to="/loja"><Button variant="outline" className="mt-4 gap-2"><ChevronLeft className="w-4 h-4" /> Voltar à loja</Button></Link>
                </div>
            </div>
        );
    }

    const images = product.imagens?.length > 0 ? product.imagens : [null];

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/loja" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ChevronLeft className="w-4 h-4" /> Voltar à loja
                    </Link>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Images */}
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
                                {images[selectedImage] ? (
                                    <img src={images[selectedImage]} alt={product.nome} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center"><Package className="w-16 h-16 text-muted-foreground/30" /></div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="flex gap-2">
                                    {images.map((img, i) => (
                                        <button key={i} onClick={() => setSelectedImage(i)} className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-primary' : 'border-transparent'}`}>
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>

                        {/* Info */}
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col">
                            <Badge variant="outline" className="w-fit mb-3">{product.tipo}</Badge>
                            <h1 className="text-2xl sm:text-3xl font-space font-bold mb-4">{product.nome}</h1>

                            <div className="flex items-center gap-3 mb-6">
                                {product.preco_promocional ? (
                                    <>
                                        <span className="text-3xl font-bold text-primary">{product.preco_promocional.toLocaleString()} MZN</span>
                                        <span className="text-lg text-muted-foreground line-through">{product.preco.toLocaleString()} MZN</span>
                                        <Badge className="bg-destructive">-{Math.round((1 - product.preco_promocional / product.preco) * 100)}%</Badge>
                                    </>
                                ) : (
                                    <span className="text-3xl font-bold">{product.preco?.toLocaleString()} MZN</span>
                                )}
                            </div>

                            <p className="text-muted-foreground mb-6 leading-relaxed">{product.descricao}</p>

                            <Separator className="my-4" />

                            {/* Quantity + Add to Cart */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="flex items-center border rounded-lg">
                                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                        <Minus className="w-4 h-4" />
                                    </Button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => setQuantity(quantity + 1)}>
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <Button className="flex-1 h-12 gap-2 text-base" onClick={handleAdd} disabled={product.stock_quantidade <= 0}>
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.stock_quantidade <= 0 ? 'Esgotado' : 'Adicionar ao Carrinho'}
                                </Button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {[
                                    { icon: Truck, text: "Entrega rápida" },
                                    { icon: Shield, text: "Pagamento seguro" },
                                    { icon: Package, text: "Garantia" },
                                ].map((feat, i) => (
                                    <div key={i} className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/50">
                                        <feat.icon className="w-5 h-5 text-primary mb-1" />
                                        <span className="text-xs text-muted-foreground">{feat.text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Technical sheet for machines */}
                            {product.ficha_tecnica && Object.keys(product.ficha_tecnica).length > 0 && (
                                <div className="mt-4">
                                    <h3 className="font-space font-semibold mb-3">Ficha Técnica</h3>
                                    <div className="space-y-2">
                                        {Object.entries(product.ficha_tecnica).filter(([_, v]) => v).map(([key, val]) => (
                                            <div key={key} className="flex justify-between py-2 border-b text-sm">
                                                <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                                                <span className="font-medium">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 text-sm text-muted-foreground">
                                {product.stock_quantidade > 0
                                    ? <span className="text-green-600">✓ Em stock ({product.stock_quantidade} unidades)</span>
                                    : <span className="text-destructive">Esgotado</span>
                                }
                                {product.sku && <span className="ml-4">SKU: {product.sku}</span>}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}