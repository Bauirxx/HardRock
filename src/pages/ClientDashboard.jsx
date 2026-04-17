<<<<<<< HEAD
import { useState, useEffect } from 'react';
=======
import { useState, useEffect, useRef } from 'react';
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import RequireRole from '../components/auth/RequireRole';
import Navbar from '../components/landing/Navbar';
<<<<<<< HEAD
import AvatarPicker from '../components/AvatarPicker';
=======
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
<<<<<<< HEAD
import { Dumbbell, CreditCard, ShoppingBag, Clock, CheckCircle, AlertCircle, User, Camera, Lock } from 'lucide-react';
=======
import { Dumbbell, CreditCard, ShoppingBag, Clock, CheckCircle, AlertCircle, User, Upload, Lock } from 'lucide-react';
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
import { motion } from 'framer-motion';
import moment from 'moment';

function ClientDashboardContent() {
    const [user, setUser] = useState(null);
    const [payments, setPayments] = useState([]);
    const [orders, setOrders] = useState([]);
<<<<<<< HEAD
=======
    const [loading, setLoading] = useState(true);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const fileInputRef = useRef(null);
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const me = await base44.auth.me();
        setUser(me);
        if (me.role === 'external_client') {
<<<<<<< HEAD
            const ordersData = await base44.entities.Order.list('-created_date', 20);
            setOrders(ordersData);
=======
            // Limited access - only orders
            const ordersData = await base44.entities.Order.list('-created_date', 20);
            setOrders(ordersData);
            setLoading(false);
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
            return;
        }
        const [paymentsData, ordersData] = await Promise.all([
            base44.entities.Payment.list('-created_date', 20),
            base44.entities.Order.list('-created_date', 20),
        ]);
        setPayments(paymentsData);
        setOrders(ordersData);
<<<<<<< HEAD
    };

    const handleAvatarChange = (url) => setUser(prev => ({ ...prev, foto_url: url }));
=======
        setLoading(false);
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingPhoto(true);
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        await base44.auth.updateMe({ foto_url: file_url });
        setUser(prev => ({ ...prev, foto_url: file_url }));
        setUploadingPhoto(false);
    };
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

    const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.valor || 0), 0);

    return (
<<<<<<< HEAD
        <div className="min-h-screen flex flex-col bg-background text-foreground">
=======
        <div className="min-h-screen flex flex-col bg-slate-950 text-white">
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <h1 className="text-3xl font-space font-bold mb-1">
                            Olá, {user?.full_name || 'Visitante'} 🤘
                        </h1>
<<<<<<< HEAD
                        <p className="text-muted-foreground">
                            {user?.role === 'external_client' ? 'Acesso à loja Hard Rock disponível.' : 'Bem-vindo à elite do Hard Rock Gym.'}
                        </p>
                        {user?.role === 'external_client' && (
                            <div className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-center gap-6">
=======
                        <p className="text-slate-400">
                            {user?.role === 'external_client' ? 'Acesso à loja Hard Rock disponível.' : 'Bem-vindo à elite do Hard Rock Gym.'}
                        </p>
                        {user?.role === 'external_client' && (
                            <div className="mt-6 p-6 rounded-2xl bg-primary/10 border border-primary/20 text-white flex flex-col sm:flex-row items-center gap-6">
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">Acesso Limitado aos Serviços</h3>
<<<<<<< HEAD
                                    <p className="text-muted-foreground mb-4 text-sm">
                                        Como cliente externo, você pode comprar produtos na nossa loja, mas ainda não tem acesso aos planos de treino e serviços do ginásio. Visite-nos para fazer o pagamento presencial e a equipa irá activar a sua conta de membro.
                                    </p>
                                    <a href={`https://wa.me/258840000000?text=${encodeURIComponent('Olá! Quero saber como tornar-me membro do Hard Rock Gym.')}`} target="_blank" rel="noreferrer">
                                        <Button className="font-bold">Quero ser Membro Hard Rock</Button>
                                    </a>
=======
                                    <p className="text-slate-400 mb-4 text-sm">
                                        Como cliente externo, você pode comprar produtos na nossa loja, mas ainda não tem acesso aos planos de treino e serviços do ginásio.
                                    </p>
                                    <Button className="font-bold">Quero ser Membro Hard Rock</Button>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {user?.role !== 'external_client' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                            {[
                                { icon: CreditCard, label: 'Total Investido', value: `${totalPaid.toLocaleString()} MZN`, color: 'text-primary' },
<<<<<<< HEAD
                                { icon: Clock, label: 'Mensalidades', value: payments.length, color: 'text-info' },
                                { icon: ShoppingBag, label: 'Encomendas', value: orders.length, color: 'text-accent' },
                                { icon: Dumbbell, label: 'Status Membro', value: 'ATIVO', color: 'text-success' },
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Card className="bg-card border-border">
                                        <CardContent className="p-5 flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">{stat.label}</p>
=======
                                { icon: Clock, label: 'Mensalidades', value: payments.length, color: 'text-blue-500' },
                                { icon: ShoppingBag, label: 'Encomendas', value: orders.length, color: 'text-purple-500' },
                                { icon: Dumbbell, label: 'Status Membro', value: 'ATIVO', color: 'text-green-500' },
                            ].map((stat, i) => (
                                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                    <Card className="bg-slate-900 border-slate-800">
                                        <CardContent className="p-5 flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${stat.color}`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-slate-400">{stat.label}</p>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                                <p className="text-xl font-space font-bold">{stat.value}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <Tabs defaultValue={user?.role === 'external_client' ? 'orders' : 'payments'} className="w-full">
<<<<<<< HEAD
                        <TabsList className="bg-card border-border mb-6">
=======
                        <TabsList className="bg-slate-900 border-slate-800 mb-6">
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                            {user?.role !== 'external_client' && <TabsTrigger value="payments" className="gap-2 data-[state=active]:bg-primary"><CreditCard className="w-4 h-4" /> Pagamentos</TabsTrigger>}
                            <TabsTrigger value="orders" className="gap-2 data-[state=active]:bg-primary"><ShoppingBag className="w-4 h-4" /> Encomendas</TabsTrigger>
                            <TabsTrigger value="profile" className="gap-2 data-[state=active]:bg-primary"><User className="w-4 h-4" /> Perfil</TabsTrigger>
                        </TabsList>

                        <TabsContent value="payments">
<<<<<<< HEAD
                            <Card className="bg-card border-border">
                                <CardHeader><CardTitle className="text-lg">Histórico de Mensalidades</CardTitle></CardHeader>
                                <CardContent>
                                    {payments.length === 0 ? (
                                        <p className="text-center text-muted-foreground/70 py-8">Nenhum registo de pagamento.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {payments.map(payment => (
                                                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/40 transition-colors">
=======
                            <Card className="bg-slate-900 border-slate-800">
                                <CardHeader><CardTitle className="text-lg">Histórico de Mensalidades</CardTitle></CardHeader>
                                <CardContent>
                                    {payments.length === 0 ? (
                                        <p className="text-center text-slate-500 py-8">Nenhum registo de pagamento.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {payments.map(payment => (
                                                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${payment.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                                payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-red-500/10 text-red-500'
                                                            }`}>
                                                            {payment.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                                                payment.status === 'pending' ? <Clock className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{payment.descricao || payment.tipo}</p>
<<<<<<< HEAD
                                                            <p className="text-xs text-muted-foreground/70">{moment(payment.created_date).format('DD/MM/YYYY HH:mm')}</p>
=======
                                                            <p className="text-xs text-slate-500">{moment(payment.created_date).format('DD/MM/YYYY HH:mm')}</p>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">{payment.valor?.toLocaleString()} MZN</p>
<<<<<<< HEAD
                                                        <Badge variant="outline" className="text-xs border-border">{payment.metodo || '-'}</Badge>
=======
                                                        <Badge variant="outline" className="text-xs border-slate-700">{payment.metodo || '-'}</Badge>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders">
<<<<<<< HEAD
                            <Card className="bg-card border-border">
=======
                            <Card className="bg-slate-900 border-slate-800">
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                <CardHeader><CardTitle className="text-lg">Compras na Loja</CardTitle></CardHeader>
                                <CardContent>
                                    {orders.length === 0 ? (
                                        <div className="text-center py-8">
<<<<<<< HEAD
                                            <p className="text-muted-foreground/70 mb-4">Ainda não fez nenhuma compra.</p>
=======
                                            <p className="text-slate-500 mb-4">Ainda não fez nenhuma compra.</p>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                            <Link to="/loja"><Button>Ir à Loja</Button></Link>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {orders.map(order => (
<<<<<<< HEAD
                                                <div key={order.id} className="p-4 rounded-xl border border-border hover:bg-muted/40 transition-colors">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <span className="font-mono text-sm font-semibold text-primary">{order.tracking_code}</span>
                                                            <span className="text-xs text-muted-foreground/70 ml-2">{moment(order.created_date).format('DD/MM/YYYY')}</span>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-muted text-white border-none">{order.status}</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">{order.items?.length || 0} item(s)</span>
=======
                                                <div key={order.id} className="p-4 rounded-xl border border-slate-800 hover:bg-slate-800/50 transition-colors">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <span className="font-mono text-sm font-semibold text-primary">{order.tracking_code}</span>
                                                            <span className="text-xs text-slate-500 ml-2">{moment(order.created_date).format('DD/MM/YYYY')}</span>
                                                        </div>
                                                        <Badge variant="secondary" className="bg-slate-800 text-white border-none">{order.status}</Badge>
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm text-slate-400">{order.items?.length || 0} item(s)</span>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                                        <span className="font-bold">{order.total?.toLocaleString()} MZN</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="profile">
<<<<<<< HEAD
                            <Card className="bg-card border-border">
=======
                            <Card className="bg-slate-900 border-slate-800">
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                <CardHeader><CardTitle className="text-lg">Meu Perfil</CardTitle></CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
<<<<<<< HEAD
                                            <AvatarPicker
                                                currentUrl={user?.foto_url}
                                                onChange={handleAvatarChange}
                                                trigger={
                                                    <button type="button" className="relative group shrink-0">
                                                        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-border">
                                                            {user?.foto_url ? (
                                                                <img src={user.foto_url} alt="Perfil" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <User className="w-10 h-10 text-muted-foreground/70" />
                                                            )}
                                                        </div>
                                                        <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <Camera className="w-5 h-5 text-white" />
                                                        </div>
                                                    </button>
                                                }
                                            />
                                            <div>
                                                <h3 className="font-semibold text-lg">{user?.full_name || 'Nome'}</h3>
                                                <p className="text-muted-foreground/70 text-sm">{user?.email}</p>
                                                <AvatarPicker
                                                    currentUrl={user?.foto_url}
                                                    onChange={handleAvatarChange}
                                                    trigger={
                                                        <Button variant="outline" size="sm" className="mt-1 gap-2 border-border bg-muted hover:bg-muted/80">
                                                            <Camera className="w-3 h-3" /> Alterar avatar
                                                        </Button>
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Separator className="bg-muted" />
                                        <div className="grid sm:grid-cols-2 gap-6 text-sm">
                                            <div>
                                                <p className="text-muted-foreground/70 mb-1">Email Registado</p>
                                                <p className="font-medium">{user?.email || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground/70 mb-1">Nível de Acesso</p>
=======
                                            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center overflow-hidden border-2 border-slate-700">
                                                    {user?.foto_url ? (
                                                        <img src={user.foto_url} alt="Perfil" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-10 h-10 text-slate-500" />
                                                    )}
                                                </div>
                                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="w-5 h-5 text-white" />
                                                </div>
                                                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-lg">{user?.full_name || 'Nome'}</h3>
                                                <p className="text-slate-500 text-sm">{user?.email}</p>
                                                <Button variant="outline" size="sm" className="mt-1 gap-2 border-slate-700 bg-slate-800 hover:bg-slate-700" onClick={() => fileInputRef.current?.click()} disabled={uploadingPhoto}>
                                                    <Upload className="w-3 h-3" /> {uploadingPhoto ? 'A carregar...' : 'Alterar foto'}
                                                </Button>
                                            </div>
                                        </div>
                                        <Separator className="bg-slate-800" />
                                        <div className="grid sm:grid-cols-2 gap-6 text-sm">
                                            <div>
                                                <p className="text-slate-500 mb-1">Email Registado</p>
                                                <p className="font-medium">{user?.email || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500 mb-1">Nível de Acesso</p>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="capitalize bg-primary text-white border-none">{user?.role?.replace('_', ' ') || 'user'}</Badge>
                                                    {user?.role === 'external_client' && <span className="text-[10px] text-primary">(Upgrade Disponível)</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default function ClientDashboard() {
    return (
        <RequireRole roles={['internal_client', 'admin', 'staff', 'external_client']}>
            <ClientDashboardContent />
        </RequireRole>
    );
}