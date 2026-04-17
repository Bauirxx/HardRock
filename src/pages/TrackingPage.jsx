import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const STATUS_MAP = {
    pending: { label: 'Pendente', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    confirmed: { label: 'Confirmada', icon: CheckCircle, color: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Em Preparação', icon: Package, color: 'bg-purple-100 text-purple-800' },
    shipped: { label: 'Enviada', icon: Truck, color: 'bg-primary/10 text-primary' },
    delivered: { label: 'Entregue', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    cancelled: { label: 'Cancelada', icon: AlertCircle, color: 'bg-red-100 text-red-800' },
};

const STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function TrackingPage() {
    const [code, setCode] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setLoading(true);
        setSearched(true);
        const orders = await base44.entities.Order.filter({ tracking_code: code.trim().toUpperCase() });
        setOrder(orders[0] || null);
        setLoading(false);
    };

    const currentStepIndex = order ? STEPS.indexOf(order.status) : -1;

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                        <h1 className="text-3xl font-space font-bold mb-2">Rastreio de Encomenda</h1>
                        <p className="text-muted-foreground">Introduza o código de rastreio para acompanhar a sua encomenda.</p>
                    </motion.div>

                    <form onSubmit={handleSearch} className="flex gap-2 mb-8">
                        <Input
                            placeholder="Ex: GYM-20250321-AB12"
                            value={code}
                            onChange={e => setCode(e.target.value)}
                            className="text-center uppercase tracking-wider font-mono"
                        />
                        <Button type="submit" className="gap-2 shrink-0" disabled={loading}>
                            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                            Rastrear
                        </Button>
                    </form>

                    {searched && !loading && !order && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                            <h3 className="font-semibold">Encomenda não encontrada</h3>
                            <p className="text-sm text-muted-foreground mt-1">Verifique o código e tente novamente.</p>
                        </motion.div>
                    )}

                    {order && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Encomenda</p>
                                            <p className="font-space font-bold text-lg">{order.tracking_code}</p>
                                        </div>
                                        <Badge className={STATUS_MAP[order.status]?.color}>
                                            {STATUS_MAP[order.status]?.label}
                                        </Badge>
                                    </div>

                                    {/* Progress Steps */}
                                    {order.status !== 'cancelled' && (
                                        <div className="flex items-center justify-between mb-8 mt-6">
                                            {STEPS.map((step, i) => {
                                                const isActive = i <= currentStepIndex;
                                                const StatusIcon = STATUS_MAP[step]?.icon || Clock;
                                                return (
                                                    <div key={step} className="flex-1 flex flex-col items-center relative">
                                                        {i > 0 && (
                                                            <div className={`absolute top-4 right-1/2 w-full h-0.5 -translate-y-1/2 ${i <= currentStepIndex ? 'bg-primary' : 'bg-muted'
                                                                }`} style={{ left: '-50%' }} />
                                                        )}
                                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                                                            }`}>
                                                            <StatusIcon className="w-4 h-4" />
                                                        </div>
                                                        <span className={`text-xs mt-2 text-center ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                                            {STATUS_MAP[step]?.label}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Order Items */}
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm">Itens da Encomenda</h4>
                                        {order.items?.map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                                                {item.imagem && <img src={item.imagem} alt="" className="w-12 h-12 rounded object-cover" />}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{item.nome}</p>
                                                    <p className="text-xs text-muted-foreground">Qtd: {item.quantidade}</p>
                                                </div>
                                                <span className="text-sm font-semibold">{(item.preco * item.quantidade).toLocaleString()} MZN</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between mt-4 pt-4 border-t font-bold">
                                        <span>Total</span>
                                        <span>{order.total?.toLocaleString()} MZN</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}