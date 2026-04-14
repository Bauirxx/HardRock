import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Eye } from 'lucide-react';
import { addToCart } from '@/lib/cartStore';
import { useToast } from '@/hooks/use-toast';

export default function ProductCard({ product }) {
    const { toast } = useToast();

    const handleAdd = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        toast({ title: "Adicionado!", description: `${product.nome} adicionado ao carrinho` });
    };

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
            <Link to={`/produto/${product.id}`} className="flex flex-col h-full">
                <div className="aspect-square relative overflow-hidden bg-muted">
                    {product.imagens?.[0] ? (
                        <img src={product.imagens[0]} alt={product.nome} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-muted-foreground/30" />
                        </div>
                    )}
                    {product.preco_promocional && (
                        <Badge className="absolute top-3 left-3 bg-destructive">
                            -{Math.round((1 - product.preco_promocional / product.preco) * 100)}%
                        </Badge>
                    )}
                    {product.stock_quantidade <= 0 && (
                        <Badge variant="secondary" className="absolute top-3 right-3">Esgotado</Badge>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                            <Button size="icon" variant="secondary" className="rounded-full">
                                <Eye className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{product.tipo}</p>
                    <h3 className="font-semibold mb-2 line-clamp-2 flex-1">{product.nome}</h3>
                    <div className="flex items-center justify-between mt-auto">
                        <div>
                            {product.preco_promocional ? (
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-primary">{product.preco_promocional.toLocaleString()} MZN</span>
                                    <span className="text-xs text-muted-foreground line-through">{product.preco.toLocaleString()}</span>
                                </div>
                            ) : (
                                <span className="font-bold">{product.preco?.toLocaleString()} MZN</span>
                            )}
                        </div>
                        <Button
                            size="icon"
                            variant="outline"
                            className="h-9 w-9 shrink-0"
                            onClick={handleAdd}
                            disabled={product.stock_quantidade <= 0}
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </Button>
                    </div>
                </CardContent>
            </Link>
        </Card>
    );
}