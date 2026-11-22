import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, CreditCard, CheckCircle, Clock } from 'lucide-react';
import moment from 'moment';
import { useToast } from '@/hooks/use-toast';

const emptyPaymentForm = {
    user: '', valor: '', tipo: 'mensalidade', metodo: 'dinheiro',
    descricao: '', status: 'completed',
};

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState(emptyPaymentForm);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadPayments();
        base44.entities.User.filter({ role: 'internal_client' })
            .then(u => setUsers(u))
            .catch(() => {});
    }, []);

    const loadPayments = async () => {
        const data = await base44.entities.Payment.list('-created_date', 100);
        setPayments(data);
        setLoading(false);
    };

    const handleCreate = async () => {
        if (!form.user || !form.valor) {
            toast({ variant: 'destructive', title: 'Utilizador e valor são obrigatórios.' });
            return;
        }
        setSaving(true);
        try {
            await base44.entities.Payment.create({
                user: form.user,
                valor: parseFloat(form.valor),
                tipo: form.tipo,
                metodo: form.metodo,
                descricao: form.descricao || form.tipo,
                status: form.status,
                data_pagamento: form.status === 'completed' ? new Date().toISOString() : null,
            });
            toast({ title: 'Pagamento registado!' });
            setDialogOpen(false);
            setForm(emptyPaymentForm);
            loadPayments();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        } finally { setSaving(false); }
    };

    const updateStatus = async (id, status) => {
        await base44.entities.Payment.update(id, { status, ...(status === 'completed' ? { data_pagamento: new Date().toISOString() } : {}) });
        toast({ title: "Estado do pagamento atualizado" });
        loadPayments();
    };

    const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter);
    const totalCompleted = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + (p.valor || 0), 0);
    const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.valor || 0), 0);

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Pagamentos</h1>
                    <p className="text-muted-foreground text-sm">{payments.length} pagamentos registados</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) setForm(emptyPaymentForm); }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Registar Pagamento</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader><DialogTitle>Registar Pagamento Manual</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <Label>Membro *</Label>
                                <Select value={form.user} onValueChange={v => setForm({ ...form, user: v })}>
                                    <SelectTrigger><SelectValue placeholder="Escolher membro..." /></SelectTrigger>
                                    <SelectContent>
                                        {users.map(u => <SelectItem key={u.id} value={u.id}>{u.full_name} — {u.email}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Valor (MZN) *</Label>
                                    <Input type="number" placeholder="0.00" value={form.valor} onChange={e => setForm({ ...form, valor: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Estado</Label>
                                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="completed">Concluído</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                            <SelectItem value="failed">Falhado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label>Tipo</Label>
                                    <Select value={form.tipo} onValueChange={v => setForm({ ...form, tipo: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="mensalidade">Mensalidade</SelectItem>
                                            <SelectItem value="inscricao">Inscrição</SelectItem>
                                            <SelectItem value="personal">Personal Trainer</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Método</Label>
                                    <Select value={form.metodo} onValueChange={v => setForm({ ...form, metodo: v })}>
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
                            </div>
                            <div>
                                <Label>Descrição</Label>
                                <Input placeholder="Ex: Mensalidade Junho 2026" value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
                            </div>
                            <Button className="w-full" onClick={handleCreate} disabled={saving}>
                                {saving ? 'A registar...' : 'Registar Pagamento'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <Card><CardContent className="p-4 flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <div><p className="text-xs text-muted-foreground">Recebido</p><p className="text-lg font-bold">{totalCompleted.toLocaleString()} MZN</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-500" />
                    <div><p className="text-xs text-muted-foreground">Pendente</p><p className="text-lg font-bold">{totalPending.toLocaleString()} MZN</p></div>
                </CardContent></Card>
                <Card><CardContent className="p-4 flex items-center gap-3">
                    <CreditCard className="w-8 h-8 text-blue-500" />
                    <div><p className="text-xs text-muted-foreground">Total Pagamentos</p><p className="text-lg font-bold">{payments.length}</p></div>
                </CardContent></Card>
            </div>

            <div className="flex gap-2 mb-4">
                {[
                    { value: 'all', label: 'Todos' },
                    { value: 'completed', label: 'Concluídos' },
                    { value: 'pending', label: 'Pendentes' },
                    { value: 'failed', label: 'Falhados' },
                ].map(opt => (
                    <button key={opt.value} onClick={() => setFilter(opt.value)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-colors ${filter === opt.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}>
                        {opt.label}
                    </button>
                ))}
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b bg-muted/30">
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Descrição</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Tipo</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Valor</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Data</th>
                            </tr></thead>
                            <tbody>
                                {filtered.map(payment => (
                                    <tr key={payment.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4 text-sm">{payment.descricao || payment.tipo}</td>
                                        <td className="p-4 hidden sm:table-cell"><Badge variant="outline" className="text-xs">{payment.metodo || '-'}</Badge></td>
                                        <td className="p-4 font-semibold">{payment.valor?.toLocaleString()} MZN</td>
                                        <td className="p-4">
                                            <Select defaultValue={payment.status} onValueChange={v => updateStatus(payment.id, v)}>
                                                <SelectTrigger className="h-8 w-32">
                                                    <Badge className={`text-xs ${payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>{payment.status}</Badge>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="pending">Pendente</SelectItem>
                                                    <SelectItem value="processing">Processando</SelectItem>
                                                    <SelectItem value="completed">Concluído</SelectItem>
                                                    <SelectItem value="failed">Falhado</SelectItem>
                                                    <SelectItem value="refunded">Reembolsado</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{moment(payment.created_date).format('DD/MM/YYYY HH:mm')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && <div className="text-center py-12 text-muted-foreground">{loading ? 'A carregar...' : 'Nenhum pagamento.'}</div>}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}