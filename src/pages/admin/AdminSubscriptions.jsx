import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plus, Edit, Trash2, Bell, Calendar, User, RefreshCw, AlertTriangle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useSearchParams } from 'react-router-dom';

const STATUS_COLORS = {
    active: 'bg-green-500/15 text-green-400 border-green-500/30',
    expired: 'bg-red-500/15 text-red-400 border-red-500/30',
    cancelled: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
    pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    suspended: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
};

const STATUS_LABELS = {
    active: 'Ativa', expired: 'Expirada', cancelled: 'Cancelada',
    pending: 'Pendente', suspended: 'Suspensa',
};

const TIPO_LABELS = {
    monthly: 'Mensal', quarterly: 'Trimestral', annual: 'Anual', custom: 'Personalizado',
};

const DURACAO_MESES = { monthly: 1, quarterly: 3, annual: 12, custom: 1 };
const DURACAO_DIAS = { monthly: 30, quarterly: 90, annual: 365, custom: 30 };

const emptyForm = {
    client: '', service: '', trainer: '', tipo_duracao: 'monthly',
    data_inicio: new Date().toISOString().split('T')[0],
    data_fim: new Date(Date.now() + 30 * 864e5).toISOString().split('T')[0],
    status: 'active', desconto: '0', valor_pago: '', metodo_pagamento: 'dinheiro', observacoes: '',
};

export default function AdminSubscriptions() {
    const [subs, setSubs] = useState([]);
    const [clients, setClients] = useState([]);
    const [services, setServices] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [checkingExpiry, setCheckingExpiry] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { toast } = useToast();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        Promise.all([
            loadSubs(),
            base44.entities.Client.list('-created_date', 200).then(setClients).catch(() => {}),
            base44.entities.Service.filter({ status: 'active' }).then(setServices).catch(() => {}),
            base44.entities.User.filter({ role: 'personal_trainer' }).then(setTrainers).catch(() => {}),
        ]);
    }, []);

    // Se veio da ficha de um cliente (/admin/subscricoes?cliente=<id>),
    // abrir logo o formulário com esse cliente pré-selecionado.
    useEffect(() => {
        const clienteId = searchParams.get('cliente');
        if (clienteId) {
            setEditing(null);
            setForm({ ...emptyForm, client: clienteId });
            setDialogOpen(true);
            searchParams.delete('cliente');
            setSearchParams(searchParams, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const loadSubs = async () => {
        setLoading(true);
        try {
            const data = await base44.subscriptions.list();
            setSubs(data);
        } catch { setSubs([]); }
        finally { setLoading(false); }
    };

    const autoFim = (inicio, tipo) => {
        if (!inicio) return '';
        const d = new Date(inicio);
        d.setDate(d.getDate() + (DURACAO_DIAS[tipo] || 30));
        return d.toISOString().split('T')[0];
    };

    // Preço base do serviço para a duração escolhida (usa preço específico se existir)
    const precoBase = (serviceId, tipo) => {
        const svc = services.find(s => s.id === serviceId);
        if (!svc) return 0;
        if (tipo === 'quarterly' && svc.preco_trimestral) return Number(svc.preco_trimestral);
        if (tipo === 'annual' && svc.preco_anual) return Number(svc.preco_anual);
        return Number(svc.preco_mensal || 0) * (DURACAO_MESES[tipo] || 1);
    };

    // Recalcula datas e total sempre que muda serviço, duração, data ou desconto
    const recalcular = (prev, patch) => {
        const next = { ...prev, ...patch };
        if (next.tipo_duracao !== 'custom' && next.data_inicio) {
            next.data_fim = autoFim(next.data_inicio, next.tipo_duracao);
        }
        const base = precoBase(next.service, next.tipo_duracao);
        const desc = parseFloat(next.desconto) || 0;
        next.valor_pago = Math.max(0, base - desc).toString();
        return next;
    };

    const handleTipoChange = (v) => setForm(prev => recalcular(prev, { tipo_duracao: v }));

    const handleSave = async () => {
        if (!form.client || !form.service || !form.data_inicio) {
            toast({ variant: 'destructive', title: 'Cliente, plano e data de início são obrigatórios.' });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                client: form.client,
                service: form.service || null,
                trainer: form.trainer || null,
                valor_pago: parseFloat(form.valor_pago) || 0,
                data_fim: form.data_fim || autoFim(form.data_inicio, form.tipo_duracao),
            };
            if (editing) {
                await base44.subscriptions.update(editing.id, payload);
                toast({ title: 'Subscrição atualizada' });
            } else {
                await base44.subscriptions.create(payload);
                toast({ title: 'Subscrição criada!' });
            }
            setDialogOpen(false);
            setEditing(null);
            setForm(emptyForm);
            loadSubs();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        } finally { setSaving(false); }
    };

    const handleEdit = (sub) => {
        setEditing(sub);
        setForm({
            client: sub.client || '',
            service: sub.service || '',
            trainer: sub.trainer || '',
            tipo_duracao: sub.tipo_duracao || 'custom',
            data_inicio: sub.data_inicio || '',
            data_fim: sub.data_fim || '',
            status: sub.status || 'active',
            desconto: sub.desconto?.toString() || '0',
            valor_pago: sub.valor_pago?.toString() || '',
            metodo_pagamento: sub.metodo_pagamento || 'dinheiro',
            observacoes: sub.observacoes || '',
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await base44.subscriptions.delete(id);
            toast({ title: 'Subscrição eliminada' });
            loadSubs();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        }
    };

    const handleCheckExpiry = async () => {
        setCheckingExpiry(true);
        try {
            const res = await base44.admin.checkExpiringSubscriptions();
            toast({ title: `Verificação concluída`, description: `${res.notified} notificações enviadas, ${res.expired_updated} expiradas atualizadas.` });
            loadSubs();
        } catch {
            toast({ variant: 'destructive', title: 'Erro ao verificar expirações' });
        } finally { setCheckingExpiry(false); }
    };

    // Resolver nomes a partir das listas carregadas (o backend só devolve ids)
    const nomeDe = (lista, id, campo = 'full_name') => {
        const item = lista.find(x => x.id === id);
        return item ? (item[campo] || item.nome || item.full_name) : null;
    };
    const enriched = subs.map(s => ({
        ...s,
        client_nome: s.client_nome || nomeDe(clients, s.client_id) || nomeDe(clients, s.cliente_id),
        service_nome: s.service_nome || nomeDe(services, s.service_id, 'nome'),
        trainer_nome: s.trainer_nome || nomeDe(trainers, s.trainer_id),
    }));

    const filtered = enriched.filter(s => {
        const matchSearch = !search ||
            (s.client_nome || '').toLowerCase().includes(search.toLowerCase()) ||
            (s.service_nome || '').toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'all' || s.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const stats = {
        active: subs.filter(s => s.status === 'active').length,
        expiring: subs.filter(s => s.status === 'active' && s.is_expiring_soon).length,
        expired: subs.filter(s => s.status === 'expired').length,
        total: subs.length,
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-space font-bold">Subscrições & Planos</h1>
                    <p className="text-muted-foreground text-sm">{subs.length} subscrições no total</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" className="gap-2" onClick={handleCheckExpiry} disabled={checkingExpiry}>
                        <Bell className="w-4 h-4" />
                        {checkingExpiry ? 'A verificar...' : 'Verificar Expirações'}
                    </Button>
                    <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) { setEditing(null); setForm(emptyForm); } }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2"><Plus className="w-4 h-4" /> Nova Subscrição</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Nova'} Subscrição</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Cliente *</Label>
                                    {(() => {
                                        const cs = clients.find(c => c.id === form.client);
                                        return form.client && cs ? (
                                            <div className="flex items-center justify-between rounded-md border border-primary/30 bg-primary/5 px-3 py-2">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <User className="w-4 h-4 text-primary flex-shrink-0" />
                                                    <span className="font-medium truncate">{cs.nome}</span>
                                                    {cs.email && <span className="text-xs text-muted-foreground truncate hidden sm:inline">{cs.email}</span>}
                                                </div>
                                                {/* Só se pode trocar o cliente ao CRIAR uma nova subscrição */}
                                                {!editing && (
                                                    <Button type="button" variant="ghost" size="sm" className="h-7 text-xs flex-shrink-0"
                                                        onClick={() => setForm(p => ({ ...p, client: '' }))}>
                                                        Trocar
                                                    </Button>
                                                )}
                                            </div>
                                        ) : (
                                            <Select value={form.client} onValueChange={v => setForm({ ...form, client: v })}>
                                                <SelectTrigger><SelectValue placeholder="Escolher cliente..." /></SelectTrigger>
                                                <SelectContent>
                                                    {clients.map(c => (
                                                        <SelectItem key={c.id} value={c.id}>{c.nome} — {c.email}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        );
                                    })()}
                                </div>
                                <div>
                                    <Label>Plano/Serviço *</Label>
                                    <Select value={form.service} onValueChange={v => {
                                        setForm(prev => recalcular(prev, { service: v }));
                                    }}>
                                        <SelectTrigger><SelectValue placeholder="Escolher plano..." /></SelectTrigger>
                                        <SelectContent>
                                            {services.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.nome} — {s.preco_mensal} MZN/mês</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Personal Trainer</Label>
                                    <Select value={form.trainer} onValueChange={v => setForm({ ...form, trainer: v === 'none' ? '' : v })}>
                                        <SelectTrigger><SelectValue placeholder="Sem PT atribuído..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Sem PT</SelectItem>
                                            {trainers.map(t => (
                                                <SelectItem key={t.id} value={t.id}>{t.full_name} — {t.especialidade || 'PT'}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Tipo de Duração</Label>
                                        <Select value={form.tipo_duracao} onValueChange={handleTipoChange}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="monthly">Mensal (30 dias)</SelectItem>
                                                <SelectItem value="quarterly">Trimestral (90 dias)</SelectItem>
                                                <SelectItem value="annual">Anual (365 dias)</SelectItem>
                                                <SelectItem value="custom">Personalizado</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label>Estado</Label>
                                        <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(STATUS_LABELS).map(([k, v]) => (
                                                    <SelectItem key={k} value={k}>{v}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Data Início *</Label>
                                        <Input type="date" value={form.data_inicio}
                                            onChange={e => setForm(prev => recalcular(prev, { data_inicio: e.target.value }))} />
                                    </div>
                                    <div>
                                        <Label>Data Fim {form.tipo_duracao !== 'custom' && <span className="text-xs text-muted-foreground">(auto)</span>}</Label>
                                        <Input type="date" value={form.data_fim}
                                            readOnly={form.tipo_duracao !== 'custom'}
                                            className={form.tipo_duracao !== 'custom' ? 'bg-muted/50 cursor-not-allowed' : ''}
                                            onChange={e => setForm({ ...form, data_fim: e.target.value })} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Preço do Plano (MZN)</Label>
                                        <Input type="number" readOnly
                                            value={precoBase(form.service, form.tipo_duracao)}
                                            className="bg-muted/50 cursor-not-allowed"
                                            title="Calculado a partir do plano e da duração" />
                                    </div>
                                    <div>
                                        <Label>Desconto (MZN)</Label>
                                        <Input type="number" min="0" value={form.desconto}
                                            placeholder="0"
                                            onChange={e => setForm(prev => recalcular(prev, { desconto: e.target.value }))} />
                                    </div>
                                </div>
                                <div className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3">
                                    <Label className="text-sm font-medium">Total a pagar (MZN)</Label>
                                    <Input type="number" min="0" value={form.valor_pago}
                                        onChange={e => setForm({ ...form, valor_pago: e.target.value })}
                                        className="mt-2 text-lg font-bold bg-background" />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Calculado automaticamente (preço − desconto). Podes ajustar manualmente, mesmo numa subscrição já paga.
                                    </p>
                                </div>
                                <div>
                                    <Label>Método de Pagamento</Label>
                                    <Select value={form.metodo_pagamento} onValueChange={v => setForm({ ...form, metodo_pagamento: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="dinheiro">Dinheiro</SelectItem>
                                            <SelectItem value="mpesa">M-Pesa</SelectItem>
                                            <SelectItem value="emola">E-Mola</SelectItem>
                                            <SelectItem value="transferencia">Transferência</SelectItem>
                                            <SelectItem value="cartao">Cartão</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Observações</Label>
                                    <Textarea value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} rows={2} />
                                </div>
                                <Button className="w-full" onClick={handleSave} disabled={saving}>
                                    {saving ? 'A guardar...' : editing ? 'Atualizar' : 'Criar Subscrição'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Ativas', value: stats.active, color: 'text-green-400' },
                    { label: 'A Expirar (7d)', value: stats.expiring, color: 'text-yellow-400', icon: AlertTriangle },
                    { label: 'Expiradas', value: stats.expired, color: 'text-red-400' },
                    { label: 'Total', value: stats.total, color: 'text-white' },
                ].map(({ label, value, color, icon: Icon }) => (
                    <Card key={label}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                {Icon && <Icon className={`w-4 h-4 ${color}`} />}
                                <p className="text-sm text-muted-foreground">{label}</p>
                            </div>
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Pesquisar cliente ou plano..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {Object.entries(STATUS_LABELS).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" onClick={loadSubs}><RefreshCw className="w-4 h-4" /></Button>
            </div>

            {/* Table */}
            <div className="rounded-xl border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium">Cliente</th>
                            <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Plano</th>
                            <th className="px-4 py-3 text-left font-medium hidden md:table-cell">PT</th>
                            <th className="px-4 py-3 text-left font-medium">Período</th>
                            <th className="px-4 py-3 text-left font-medium">Estado</th>
                            <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Valor</th>
                            <th className="px-4 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">A carregar...</td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={7} className="py-12 text-center text-muted-foreground">Nenhuma subscrição encontrada.</td></tr>
                        ) : filtered.map(sub => (
                            <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                        <div>
                                            <p className="font-medium">{sub.client_nome || '—'}</p>
                                            <p className="text-xs text-muted-foreground">{TIPO_LABELS[sub.tipo_duracao]}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    {sub.service_nome || <span className="text-muted-foreground">—</span>}
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    {sub.trainer_nome || <span className="text-muted-foreground">Sem PT</span>}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1 text-xs">
                                        <Calendar className="w-3 h-3 text-muted-foreground" />
                                        <span>{sub.data_inicio}</span>
                                        <span className="text-muted-foreground">→</span>
                                        <span>{sub.data_fim}</span>
                                    </div>
                                    {sub.is_expiring_soon && (
                                        <span className="text-xs text-yellow-400 flex items-center gap-1 mt-1">
                                            <AlertTriangle className="w-3 h-3" /> {sub.dias_restantes}d restantes
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[sub.status] || ''}`}>
                                        {STATUS_LABELS[sub.status] || sub.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden lg:table-cell font-medium">
                                    {parseFloat(sub.valor_pago || 0).toLocaleString()} MZN
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(sub)}>
                                            <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget({ id: sub.id, label: `subscrição de ${sub.client_nome || 'membro'}` })}>
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar subscrição?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que quer eliminar a <strong>{deleteTarget?.label}</strong>? Esta acção não pode ser revertida.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => { handleDelete(deleteTarget.id); setDeleteTarget(null); }}>
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
