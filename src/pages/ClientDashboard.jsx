import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import RequireRole from '../components/auth/RequireRole';
import Navbar from '../components/landing/Navbar';
import AvatarPicker from '../components/AvatarPicker';
import NotificationBell from '../components/NotificationBell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    Dumbbell, CreditCard, ShoppingBag, Clock, CheckCircle, AlertCircle,
    User, Camera, Lock, KeyRound, Eye, EyeOff, Calendar,
    AlertTriangle, ShoppingCart, Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import moment from 'moment';

const ORDER_STATUS_COLORS = {
    delivered: 'bg-green-500/20 text-green-400',
    shipped: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-red-500/20 text-red-400',
    confirmed: 'bg-teal-500/20 text-teal-400',
    processing: 'bg-purple-500/20 text-purple-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
};

const ORDER_STATUS_LABELS = {
    delivered: 'Entregue', shipped: 'Enviado', cancelled: 'Cancelado',
    confirmed: 'Confirmado', processing: 'A processar', pending: 'Pendente',
};

const SESSION_STATUS_COLORS = {
    scheduled: 'bg-blue-500/15 text-blue-400',
    completed: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-red-500/15 text-red-400',
    missed: 'bg-gray-500/15 text-gray-400',
};

// ─── Shared UI pieces ──────────────────────────────────────────────────────────

function HeroHeader({ user, onAvatarChange, subtitle }) {
    return (
        <div className="relative bg-gradient-to-r from-black via-zinc-900 to-black pt-28 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-5 relative z-10">
                <AvatarPicker currentUrl={user?.foto_url} onChange={onAvatarChange}
                    trigger={
                        <button type="button" className="relative group shrink-0">
                            <div className="w-20 h-20 rounded-full ring-4 ring-primary/40 bg-zinc-800 flex items-center justify-center overflow-hidden">
                                {user?.foto_url
                                    ? <img src={user.foto_url} alt="Perfil" className="w-full h-full object-cover" />
                                    : <User className="w-10 h-10 text-zinc-400" />}
                            </div>
                            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="w-5 h-5 text-white" />
                            </div>
                        </button>
                    }
                />
                <div className="flex-1">
                    <p className="text-primary text-sm font-semibold tracking-widest uppercase mb-0.5">A Minha Conta</p>
                    <h1 className="text-2xl sm:text-3xl font-space font-bold text-white leading-tight">
                        Olá, {user?.full_name?.split(' ')[0] || 'Utilizador'} 👋
                    </h1>
                    <p className="text-zinc-400 text-sm mt-1">{subtitle}</p>
                </div>
                {user && <NotificationBell userId={user.id} />}
            </div>
        </div>
    );
}

function SecurityTab({ pwForm, setPwForm, showPw, setShowPw, savingPw, onSave }) {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <KeyRound className="w-5 h-5 text-primary" /> Alterar Senha
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label>Senha Atual</Label>
                    <div className="relative">
                        <Input type={showPw ? 'text' : 'password'} className="pr-10"
                            value={pwForm.current} onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))} />
                        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Nova Senha</Label>
                    <Input type={showPw ? 'text' : 'password'} value={pwForm.next}
                        onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))} />
                </div>
                <div className="space-y-2">
                    <Label>Confirmar Nova Senha</Label>
                    <Input type={showPw ? 'text' : 'password'} value={pwForm.confirm}
                        onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))} />
                </div>
                {pwForm.next && pwForm.confirm && pwForm.next !== pwForm.confirm && (
                    <p className="text-xs text-destructive">As senhas não coincidem.</p>
                )}
                <Button onClick={onSave} disabled={savingPw} className="w-full font-bold">
                    {savingPw ? 'A alterar...' : 'Alterar Senha'}
                </Button>
            </CardContent>
        </Card>
    );
}

function ProfileTab({ user, clientProfile, onAvatarChange }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> Informações do Perfil
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-muted/40 rounded-xl">
                        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-primary/30">
                            {user?.foto_url
                                ? <img src={user.foto_url} alt="Perfil" className="w-full h-full object-cover" />
                                : <User className="w-7 h-7 text-muted-foreground" />}
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold">{user?.full_name}</p>
                            <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </div>
                        <AvatarPicker currentUrl={user?.foto_url} onChange={onAvatarChange}
                            trigger={
                                <Button variant="outline" size="sm" className="gap-2 shrink-0">
                                    <Camera className="w-3 h-3" /> Foto
                                </Button>
                            }
                        />
                    </div>
                    <Separator />
                    <div className="grid sm:grid-cols-2 gap-6 text-sm">
                        <div>
                            <p className="text-muted-foreground/70 mb-1">Email</p>
                            <p className="font-medium">{user?.email || '-'}</p>
                        </div>
                        <div>
                            <p className="text-muted-foreground/70 mb-1">Tipo de Conta</p>
                            <Badge className="bg-primary text-white border-none">
                                {user?.role === 'internal_client' ? 'Membro' :
                                 user?.role === 'external_client' ? 'Cliente Externo' :
                                 user?.role?.replace(/_/g, ' ') || 'user'}
                            </Badge>
                        </div>
                        {user?.telefone && (
                            <div>
                                <p className="text-muted-foreground/70 mb-1">Telefone</p>
                                <p className="font-medium">{user.telefone}</p>
                            </div>
                        )}
                        {clientProfile?.historico_doencas && (
                            <div className="sm:col-span-2">
                                <p className="text-muted-foreground/70 mb-1">Histórico de Saúde</p>
                                <p className="text-sm bg-muted/50 rounded-lg p-3">{clientProfile.historico_doencas}</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function OrdersTab({ orders }) {
    return (
        <Card>
            <CardHeader><CardTitle className="text-lg">As Minhas Compras</CardTitle></CardHeader>
            <CardContent>
                {orders.length === 0 ? (
                    <div className="text-center py-8">
                        <ShoppingCart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                        <p className="text-muted-foreground/70 mb-4">Ainda não fez nenhuma compra.</p>
                        <Link to="/loja"><Button>Ir à Loja</Button></Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map(order => (
                            <div key={order.id} className="p-4 rounded-xl border hover:bg-muted/40 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                    <div>
                                        <span className="font-mono text-sm font-semibold text-primary">{order.tracking_code}</span>
                                        <span className="text-xs text-muted-foreground/70 ml-2">{moment(order.created_date).format('DD/MM/YYYY')}</span>
                                    </div>
                                    <Badge className={`border-none text-xs ${ORDER_STATUS_COLORS[order.status] || 'bg-muted text-muted-foreground'}`}>
                                        {ORDER_STATUS_LABELS[order.status] || order.status}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">{order.items?.length || 0} item(s)</span>
                                    <span className="font-bold">{parseFloat(order.total)?.toLocaleString()} MZN</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ─── External Client Dashboard ─────────────────────────────────────────────────
// Only sees: store orders + profile + security. NO gym features.

function ExternalClientDashboard({ user, orders, clientProfile, tenant, onAvatarChange }) {
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [savingPw, setSavingPw] = useState(false);
    const { toast } = useToast();

    const handleChangePassword = async () => {
        if (!pwForm.current || !pwForm.next) { toast({ variant: 'destructive', title: 'Preencha todos os campos' }); return; }
        if (pwForm.next !== pwForm.confirm) { toast({ variant: 'destructive', title: 'As senhas não coincidem' }); return; }
        if (pwForm.next.length < 6) { toast({ variant: 'destructive', title: 'Mínimo 6 caracteres' }); return; }
        setSavingPw(true);
        try {
            await base44.users.changePassword(pwForm.current, pwForm.next);
            toast({ title: 'Senha alterada com sucesso!' });
            setPwForm({ current: '', next: '', confirm: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        } finally { setSavingPw(false); }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1 pb-16">
                <HeroHeader user={user} onAvatarChange={onAvatarChange}
                    subtitle="Conta de loja — acesso a produtos e equipamentos" />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    {/* Membership CTA banner */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="p-6 rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                <Dumbbell className="w-8 h-8 text-primary" />
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-xl font-bold mb-1">Torna-te Membro {tenant?.nome || 'Hard Rock Gym'} 🏋️</h3>
                                <p className="text-muted-foreground text-sm mb-4">
                                    Como cliente externo tens acesso à loja. Torna-te membro para aceder à área do ginásio,
                                    planos de treino, Personal Trainers e muito mais.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                    <Button className="font-bold gap-2" onClick={() => {
                                        const gymName = tenant?.nome || 'Hard Rock Gym';
                                        const phone = tenant?.whatsapp_number || '258840000000';
                                        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(`Olá! Quero tornar-me membro do ${gymName}.`)}`, '_blank');
                                    }}>
                                        <Star className="w-4 h-4" /> Quero ser Membro
                                    </Button>
                                    <Link to="/loja">
                                        <Button variant="outline" className="gap-2">
                                            <ShoppingCart className="w-4 h-4" /> Ir à Loja
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* What members get */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-8">
                        {[
                            { icon: Dumbbell, title: 'Área do Ginásio', desc: 'Acesso completo às instalações e equipamentos' },
                            { icon: User, title: 'Personal Trainer', desc: 'Sessões personalizadas com treinadores certificados' },
                            { icon: Calendar, title: 'Planos & Sessões', desc: 'Agenda de treinos e acompanhamento de progresso' },
                        ].map((f, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card className="border-dashed opacity-70 hover:opacity-90 transition-opacity">
                                    <CardContent className="p-5 text-center">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                                            <f.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-sm mb-1">{f.title}</h4>
                                        <p className="text-xs text-muted-foreground">{f.desc}</p>
                                        <Badge variant="outline" className="mt-2 text-xs text-muted-foreground">
                                            <Lock className="w-3 h-3 mr-1" /> Só para membros
                                        </Badge>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <Tabs defaultValue="orders" className="w-full">
                        <TabsList className="bg-card border mb-6 p-1">
                            <TabsTrigger value="orders" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                                <ShoppingBag className="w-4 h-4" /> Encomendas
                            </TabsTrigger>
                            <TabsTrigger value="profile" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                                <User className="w-4 h-4" /> Perfil
                            </TabsTrigger>
                            <TabsTrigger value="security" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                                <KeyRound className="w-4 h-4" /> Segurança
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="orders"><OrdersTab orders={orders} /></TabsContent>
                        <TabsContent value="profile"><ProfileTab user={user} clientProfile={clientProfile} onAvatarChange={onAvatarChange} /></TabsContent>
                        <TabsContent value="security">
                            <SecurityTab pwForm={pwForm} setPwForm={setPwForm} showPw={showPw}
                                setShowPw={setShowPw} savingPw={savingPw} onSave={handleChangePassword} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

// ─── Internal Client Dashboard ─────────────────────────────────────────────────
// Full gym member access: dashboard, subscriptions, sessions, payments, orders, profile

function InternalClientDashboard({ user, orders, clientProfile, payments, subscriptions, sessions, services, tenant, onAvatarChange }) {
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [showPw, setShowPw] = useState(false);
    const [savingPw, setSavingPw] = useState(false);
    const [showPlansModal, setShowPlansModal] = useState(false);
    const { toast } = useToast();

    const activeSub = subscriptions.find(s => s.status === 'active');
    const upcomingSessions = sessions.filter(s => s.status === 'scheduled' && new Date(s.data) >= new Date()).slice(0, 5);
    const totalPaid = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (parseFloat(p.valor) || 0), 0);

    const handleChangePassword = async () => {
        if (!pwForm.current || !pwForm.next) { toast({ variant: 'destructive', title: 'Preencha todos os campos' }); return; }
        if (pwForm.next !== pwForm.confirm) { toast({ variant: 'destructive', title: 'As senhas não coincidem' }); return; }
        if (pwForm.next.length < 6) { toast({ variant: 'destructive', title: 'Mínimo 6 caracteres' }); return; }
        setSavingPw(true);
        try {
            await base44.users.changePassword(pwForm.current, pwForm.next);
            toast({ title: 'Senha alterada com sucesso!' });
            setPwForm({ current: '', next: '', confirm: '' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        } finally { setSavingPw(false); }
    };

    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navbar />
            <main className="flex-1 pb-16">
                <HeroHeader user={user} onAvatarChange={onAvatarChange} subtitle={`Membro ${tenant?.nome || 'Hard Rock Gym'} 🏋️`} />

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    {/* Stats bar */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: CreditCard, label: 'Total Investido', value: `${totalPaid.toLocaleString()} MZN`, color: 'text-primary' },
                            { icon: Calendar, label: 'Sessões', value: sessions.length, color: 'text-blue-400' },
                            { icon: ShoppingBag, label: 'Encomendas', value: orders.length, color: 'text-purple-400' },
                            { icon: Dumbbell, label: 'Status', value: activeSub ? 'ATIVO' : 'SEM PLANO', color: activeSub ? 'text-green-400' : 'text-yellow-400' },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card>
                                    <CardContent className="p-5 flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                            <p className="text-xl font-space font-bold">{stat.value}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <Tabs defaultValue="dashboard" className="w-full">
                        <TabsList className="bg-card border mb-6 flex-wrap h-auto gap-1 p-1">
                            {[
                                { value: 'dashboard', label: 'Início', icon: Dumbbell },
                                { value: 'payments', label: 'Pagamentos', icon: CreditCard },
                                { value: 'orders', label: 'Encomendas', icon: ShoppingBag },
                                { value: 'profile', label: 'Perfil', icon: User },
                                { value: 'security', label: 'Segurança', icon: KeyRound },
                            ].map(t => (
                                <TabsTrigger key={t.value} value={t.value} className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white">
                                    <t.icon className="w-4 h-4" /> {t.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {/* Gym Dashboard */}
                        <TabsContent value="dashboard" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Dumbbell className="w-5 h-5 text-primary" /> Plano Atual
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {activeSub ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between gap-4 flex-wrap">
                                                <div>
                                                    <h3 className="text-xl font-bold">{activeSub.service_nome || 'Plano Personalizado'}</h3>
                                                    <p className="text-muted-foreground text-sm mt-1">
                                                        {moment(activeSub.data_inicio).format('DD/MM/YYYY')} → {moment(activeSub.data_fim).format('DD/MM/YYYY')}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <Badge className="bg-green-500/15 text-green-400 border-green-500/30">Ativa</Badge>
                                                    <p className="text-sm text-muted-foreground mt-1">{activeSub.dias_restantes} dias restantes</p>
                                                </div>
                                            </div>
                                            {activeSub.is_expiring_soon && (
                                                <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm">
                                                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                                    O seu plano expira em breve! Contacte-nos para renovar.
                                                </div>
                                            )}
                                            {activeSub.trainer_nome && (
                                                <div className="rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 to-transparent overflow-hidden">
                                                    <div className="flex items-center gap-4 p-4">
                                                        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-primary/30">
                                                            {activeSub.trainer_foto_url
                                                                ? <img src={activeSub.trainer_foto_url} alt={activeSub.trainer_nome} className="w-full h-full object-cover" />
                                                                : <User className="w-7 h-7 text-primary" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-xs text-primary font-semibold tracking-wide uppercase mb-0.5">O Teu Personal Trainer</p>
                                                            <p className="font-bold text-base leading-tight">{activeSub.trainer_nome}</p>
                                                            {activeSub.trainer_especialidade && (
                                                                <p className="text-xs text-muted-foreground mt-0.5">{activeSub.trainer_especialidade}</p>
                                                            )}
                                                        </div>
                                                        {activeSub.trainer_clientes_ativos != null && (
                                                            <div className="text-right shrink-0">
                                                                <p className="text-2xl font-bold text-primary">{activeSub.trainer_clientes_ativos}</p>
                                                                <p className="text-xs text-muted-foreground">clientes</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {activeSub.trainer_bio && (
                                                        <div className="px-4 pb-4">
                                                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{activeSub.trainer_bio}</p>
                                                        </div>
                                                    )}
                                                    {activeSub.trainer_telefone && (
                                                        <div className="px-4 pb-4 pt-0">
                                                            <a
                                                                href={`https://wa.me/${activeSub.trainer_telefone.replace(/\D/g, '')}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 text-xs text-primary hover:underline font-medium"
                                                            >
                                                                Contactar via WhatsApp →
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Dumbbell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                                            <p className="text-muted-foreground mb-3">Nenhum plano ativo.</p>
                                            <Button size="sm" onClick={() => setShowPlansModal(true)}>Ver Planos Disponíveis</Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Calendar className="w-5 h-5 text-primary" /> Próximas Sessões
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {upcomingSessions.length === 0 ? (
                                        <p className="text-muted-foreground text-sm text-center py-6">Nenhuma sessão agendada.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {upcomingSessions.map(s => (
                                                <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary flex-shrink-0">
                                                        <span className="text-xs font-bold">{moment(s.data).format('DD')}</span>
                                                        <span className="text-[10px]">{moment(s.data).format('MMM')}</span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{s.hora_inicio}{s.hora_fim ? ` — ${s.hora_fim}` : ''}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {s.trainer_nome ? `com ${s.trainer_nome}` : 'Sessão de treino'}
                                                            {s.local ? ` • ${s.local}` : ''}
                                                        </p>
                                                    </div>
                                                    <Badge className={`text-xs ${SESSION_STATUS_COLORS[s.status] || ''}`}>
                                                        {s.status === 'scheduled' ? 'Agendada' : s.status}
                                                    </Badge>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Payments */}
                        <TabsContent value="payments">
                            <Card>
                                <CardHeader><CardTitle className="text-lg">Histórico de Pagamentos</CardTitle></CardHeader>
                                <CardContent>
                                    {payments.length === 0 ? (
                                        <p className="text-center text-muted-foreground/70 py-8">Nenhum registo de pagamento.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {payments.map(payment => (
                                                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl border hover:bg-muted/40 transition-colors">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                            payment.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                                            payment.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                                            'bg-red-500/10 text-red-500'
                                                        }`}>
                                                            {payment.status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                                                             payment.status === 'pending' ? <Clock className="w-5 h-5" /> :
                                                             <AlertCircle className="w-5 h-5" />}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm">{payment.descricao || payment.tipo}</p>
                                                            <p className="text-xs text-muted-foreground/70">{moment(payment.created_date).format('DD/MM/YYYY HH:mm')}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold">{parseFloat(payment.valor)?.toLocaleString()} MZN</p>
                                                        <Badge variant="outline" className="text-xs">{payment.metodo || '-'}</Badge>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="orders"><OrdersTab orders={orders} /></TabsContent>
                        <TabsContent value="profile"><ProfileTab user={user} clientProfile={clientProfile} onAvatarChange={onAvatarChange} /></TabsContent>
                        <TabsContent value="security">
                            <SecurityTab pwForm={pwForm} setPwForm={setPwForm} showPw={showPw}
                                setShowPw={setShowPw} savingPw={savingPw} onSave={handleChangePassword} />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>

            {/* Plans modal — only for internal members */}
            <Dialog open={showPlansModal} onOpenChange={setShowPlansModal}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-primary" /> Planos Disponíveis
                        </DialogTitle>
                    </DialogHeader>
                    {services.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground">
                            <Dumbbell className="w-10 h-10 mx-auto mb-3 opacity-30" />
                            <p>Nenhum plano disponível de momento.</p>
                            <p className="text-sm mt-1">Contacte a recepção para mais informações.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {services.map(s => (
                                <div key={s.id} className="rounded-xl border overflow-hidden hover:shadow-md transition-shadow">
                                    <div className="h-1.5" style={{ backgroundColor: s.cor || '#10B981' }} />
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <h3 className="font-bold text-base">{s.nome}</h3>
                                            {s.preco_mensal > 0 && (
                                                <span className="text-primary font-bold text-lg">{Number(s.preco_mensal).toLocaleString('pt-MZ')} MT</span>
                                            )}
                                        </div>
                                        {s.descricao && <p className="text-sm text-muted-foreground mb-3">{s.descricao}</p>}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {s.sessoes_semanais > 0 && <Badge variant="secondary" className="text-xs">{s.sessoes_semanais}x/semana</Badge>}
                                            {s.duracao_minutos > 0 && <Badge variant="secondary" className="text-xs">{s.duracao_minutos} min</Badge>}
                                            {s.inclui_pt && <Badge className="text-xs bg-primary/20 text-primary">Inclui PT</Badge>}
                                        </div>
                                        {Array.isArray(s.beneficios) && s.beneficios.map((b, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm mb-1">
                                                <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />{b}
                                            </div>
                                        ))}
                                        <p className="text-xs text-muted-foreground mt-3">Fale com a recepção para ativar este plano.</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ─── Main router component ─────────────────────────────────────────────────────

function ClientDashboardContent() {
    const [user, setUser] = useState(null);
    const [tenant, setTenant] = useState(null);
    const [clientProfile, setClientProfile] = useState(null);
    const [payments, setPayments] = useState([]);
    const [orders, setOrders] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleAvatarChange = async (url) => {
        setUser(prev => ({ ...prev, foto_url: url }));
        await base44.auth.updateMe({ foto_url: url });
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [me, tenants] = await Promise.all([
                    base44.auth.me(),
                    base44.entities.Tenant.list('-created_date', 1).catch(() => []),
                ]);
                setUser(me);
                if (tenants.length) setTenant(tenants[0]);

                // Backend scopes orders to the authenticated user — no client-side filter needed
                const myOrders = await base44.entities.Order.list('-created_date', 50).catch(() => []);
                setOrders(myOrders);

                // External clients only get orders — stop here
                if (me.role === 'external_client') return;

                // Internal members: load full gym data
                const [paymentsData, clients, svcs] = await Promise.all([
                    base44.entities.Payment.list('-created_date', 100).catch(() => []),
                    base44.entities.Client.list('-created_date', 50).catch(() => []),
                    base44.entities.Service.list('-created_date', 50).catch(() => []),
                ]);
                setPayments(paymentsData);
                setServices(svcs.filter(s => s.status !== 'inactive'));

                // Backend scopes clients to the logged-in user — take first result
                const myClient = clients[0] || null;
                if (myClient) {
                    setClientProfile(myClient);
                    const [subs, sess] = await Promise.all([
                        base44.subscriptions.list({ client_id: myClient.id }).catch(() => []),
                        base44.sessions.list({ client_id: myClient.id }).catch(() => []),
                    ]);
                    setSubscriptions(subs);
                    setSessions(sess);
                }
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading || !user) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // Route to correct dashboard based on role
    if (user.role === 'external_client') {
        return (
            <ExternalClientDashboard
                user={user}
                orders={orders}
                clientProfile={clientProfile}
                tenant={tenant}
                onAvatarChange={handleAvatarChange}
            />
        );
    }

    return (
        <InternalClientDashboard
            user={user}
            orders={orders}
            clientProfile={clientProfile}
            payments={payments}
            subscriptions={subscriptions}
            sessions={sessions}
            services={services}
            tenant={tenant}
            onAvatarChange={handleAvatarChange}
        />
    );
}

export default function ClientDashboard() {
    return (
        <RequireRole roles={['internal_client', 'admin', 'staff', 'external_client', 'personal_trainer']}>
            <ClientDashboardContent />
        </RequireRole>
    );
}
