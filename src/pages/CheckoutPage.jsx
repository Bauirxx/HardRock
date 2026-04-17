import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, CreditCard, Smartphone, Banknote, CheckCircle, Lock } from 'lucide-react';
import { useCart, clearCart } from '@/lib/cartStore';
import { generateTrackingCode, getCurrentTenantId } from '@/lib/tenantStore';
import { motion } from 'framer-motion';

export default function CheckoutPage() {
    const cart = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [trackingCode, setTrackingCode] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('mpesa');
    const [form, setForm] = useState({
        nome: '', email: '', telefone: '',
        rua: '', cidade: '', codigo_postal: '',
    });

    const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const code = generateTrackingCode();

        await base44.entities.Order.create({
            tenant_id: getCurrentTenantId() || 'default',
            guest_name: form.nome,
            guest_email: form.email,
            guest_phone: form.telefone,
            endereco_entrega: {
                rua: form.rua,
                cidade: form.cidade,
                codigo_postal: form.codigo_postal,
                pais: 'Moçambique',
            },
            items: cart.items.map(i => ({
                product_id: i.product_id,
                nome: i.nome,
                preco: i.preco,
                quantidade: i.quantidade,
                imagem: i.imagem,
            })),
            subtotal: cart.total,
            taxa_entrega: 0,
            total: cart.total,
            metodo_pagamento: paymentMethod,
            status: 'pending',
            status_pagamento: 'pending',
            tracking_code: code,
        });

        await base44.entities.Payment.create({
            tenant_id: getCurrentTenantId() || 'default',
            tipo: 'produto',
            descricao: `Encomenda ${code} - ${cart.count} item(s)`,
            valor: cart.total,
            metodo: paymentMethod,
            status: 'pending',
        });

        setTrackingCode(code);
        setSuccess(true);
        clearCart();
        setLoading(false);
    };

    if (success) {
        return (
            <div className="min-h-screen">
                <Navbar />
                <div className="pt-32 max-w-lg mx-auto px-4 text-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-primary" />
                        </div>
                    </motion.div>
                    <h1 className="text-2xl font-space font-bold mb-2">Encomenda Confirmada!</h1>
                    <p className="text-muted-foreground mb-6">A sua encomenda foi recebida com sucesso.</p>
                    <Card className="mb-6">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Código de Rastreio</p>
                            <p className="text-2xl font-space font-bold text-primary">{trackingCode}</p>
                            <p className="text-sm text-muted-foreground mt-2">Guarde este código para acompanhar a sua encomenda.</p>
                        </CardContent>
                    </Card>
                    <div className="flex gap-3 justify-center">
                        <Link to="/rastreio"><Button variant="outline">Rastrear Encomenda</Button></Link>
                        <Link to="/"><Button>Voltar ao Início</Button></Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cart.items.length === 0) {
        navigate('/carrinho');
        return null;
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/carrinho" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
                        <ChevronLeft className="w-4 h-4" /> Voltar ao carrinho
                    </Link>
                    <h1 className="text-3xl font-space font-bold mb-8">Checkout</h1>

                    <form onSubmit={handleSubmit}>
                        <div className="grid lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-6">
                                {/* Personal Info */}
                                <Card>
                                    <CardHeader><CardTitle className="text-lg">Dados Pessoais</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Nome completo *</Label>
                                                <Input required value={form.nome} onChange={e => updateField('nome', e.target.value)} />
                                            </div>
                                            <div>
                                                <Label>Telefone *</Label>
                                                <Input required value={form.telefone} onChange={e => updateField('telefone', e.target.value)} placeholder="+258 84..." />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Email</Label>
                                            <Input type="email" value={form.email} onChange={e => updateField('email', e.target.value)} />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Address */}
                                <Card>
                                    <CardHeader><CardTitle className="text-lg">Endereço de Entrega</CardTitle></CardHeader>
                                    <CardContent className="space-y-4">
                                        <div>
                                            <Label>Rua / Morada *</Label>
                                            <Input required value={form.rua} onChange={e => updateField('rua', e.target.value)} />
                                        </div>
                                        <div className="grid sm:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Cidade *</Label>
                                                <Input required value={form.cidade} onChange={e => updateField('cidade', e.target.value)} />
                                            </div>
                                            <div>
                                                <Label>Código Postal</Label>
                                                <Input value={form.codigo_postal} onChange={e => updateField('codigo_postal', e.target.value)} />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Payment Method */}
                                <Card>
                                    <CardHeader><CardTitle className="text-lg">Método de Pagamento</CardTitle></CardHeader>
                                    <CardContent>
                                        <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                                            {[
                                                { value: 'mpesa', icon: Smartphone, label: 'M-Pesa', desc: 'Pagamento via telemóvel' },
                                                { value: 'emola', icon: Smartphone, label: 'e-Mola', desc: 'Pagamento via Vodacom' },
                                                { value: 'card', icon: CreditCard, label: 'Cartão', desc: 'Visa / Mastercard' },
                                                { value: 'cash', icon: Banknote, label: 'Dinheiro', desc: 'Pagamento na entrega' },
                                            ].map(method => (
                                                <label key={method.value} className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === method.value ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                                                    <RadioGroupItem value={method.value} />
                                                    <method.icon className="w-5 h-5 text-muted-foreground" />
                                                    <div>
                                                        <p className="font-medium text-sm">{method.label}</p>
                                                        <p className="text-xs text-muted-foreground">{method.desc}</p>
                                                    </div>
                                                </label>
                                            ))}
                                        </RadioGroup>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Order Summary */}
                            <div>
                                <Card className="sticky top-24">
                                    <CardContent className="p-6">
                                        <h3 className="font-space font-semibold mb-4">Resumo da Encomenda</h3>
                                        <div className="space-y-3 mb-4">
                                            {cart.items.map(item => (
                                                <div key={item.product_id} className="flex justify-between text-sm">
                                                    <span className="text-muted-foreground">{item.nome} × {item.quantidade}</span>
                                                    <span>{(item.preco * item.quantidade).toLocaleString()} MZN</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="space-y-2 text-sm mb-4">
                                            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{cart.total.toLocaleString()} MZN</span></div>
                                            <div className="flex justify-between"><span className="text-muted-foreground">Entrega</span><span className="text-primary">Grátis</span></div>
                                        </div>
                                        <Separator className="my-4" />
                                        <div className="flex justify-between font-bold text-lg mb-6">
                                            <span>Total</span>
                                            <span>{cart.total.toLocaleString()} MZN</span>
                                        </div>
                                        <Button type="submit" className="w-full h-12 gap-2 text-base" disabled={loading}>
                                            {loading ? (
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <><Lock className="w-4 h-4" /> Confirmar Encomenda</>
                                            )}
                                        </Button>
                                        <p className="text-xs text-center text-muted-foreground mt-3 flex items-center justify-center gap-1">
                                            <Lock className="w-3 h-3" /> Pagamento 100% seguro
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}