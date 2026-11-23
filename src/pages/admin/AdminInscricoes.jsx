import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Trash2, Phone, Mail, Clock, Search, User } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const STATUS_BADGE = {
    pendente: 'bg-yellow-100 text-yellow-800',
    aprovado: 'bg-green-100 text-green-800',
    rejeitado: 'bg-red-100 text-red-800',
};

export default function AdminInscricoes() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('pendente');
    const [busca, setBusca] = useState('');
    const [ordenar, setOrdenar] = useState('recentes');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { toast } = useToast();

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await base44.entities.GymApplication.list('-created_date', 200);
            setItems(Array.isArray(data) ? data : []);
        } catch (e) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message });
        } finally {
            setLoading(false);
        }
    };

    const mudarEstado = async (id, status) => {
        try {
            await base44.entities.GymApplication.update(id, { status });
            toast({ title: status === 'aprovado' ? 'Inscrição aprovada' : status === 'rejeitado' ? 'Inscrição rejeitada' : 'Estado atualizado' });
            loadData();
        } catch (e) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message });
        }
    };

    // Aprovar E inscrever: cria o membro a partir do pedido (dispara o email de
    // credenciais se houver email) e marca o pedido como aprovado. Fecha o ciclo.
    const aprovarEInscrever = async (s) => {
        try {
            await base44.admin.createInternalClient({
                full_name: s.nome,
                telefone: s.telefone,
                email: s.email,
                genero: s.sexo || undefined,
            });
            await base44.entities.GymApplication.update(s.id, { status: 'aprovado' });
            toast({
                title: 'Membro inscrito',
                description: s.email
                    ? `${s.nome} foi inscrito e recebeu as credenciais por email.`
                    : `${s.nome} foi inscrito. (Sem email — credenciais não enviadas.)`,
            });
            loadData();
        } catch (e) {
            toast({ variant: 'destructive', title: 'Erro ao inscrever', description: e.message });
        }
    };

    const handleDelete = async (id) => {
        try {
            await base44.entities.GymApplication.delete(id);
            toast({ title: 'Solicitação removida' });
            loadData();
        } catch (e) {
            toast({ variant: 'destructive', title: 'Erro', description: e.message });
        }
    };

    const pendentes = items.filter(i => i.status === 'pendente').length;

    const visiveis = items
        .filter(s => !filtro || s.status === filtro)
        .filter(s => {
            const q = busca.trim().toLowerCase();
            if (!q) return true;
            return (s.nome || '').toLowerCase().includes(q)
                || (s.email || '').toLowerCase().includes(q)
                || (s.telefone || '').includes(q);
        })
        .sort((a, b) => {
            switch (ordenar) {
                case 'nome': return (a.nome || '').localeCompare(b.nome || '');
                case 'idade': return (b.idade || 0) - (a.idade || 0);
                case 'sexo': return (a.sexo || '').localeCompare(b.sexo || '');
                default: return new Date(b.dataCriacao || 0) - new Date(a.dataCriacao || 0);
            }
        });

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                    <h1 className="text-2xl font-space font-bold">Pedidos de Inscrição</h1>
                    <p className="text-muted-foreground text-sm">{items.length} pedidos · {pendentes} pendentes</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input className="pl-10" placeholder="Pesquisar por nome, email ou telefone..."
                        value={busca} onChange={e => setBusca(e.target.value)} />
                </div>
                <Select value={filtro || 'todos'} onValueChange={v => setFiltro(v === 'todos' ? '' : v)}>
                    <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos os estados</SelectItem>
                        <SelectItem value="pendente">Pendentes</SelectItem>
                        <SelectItem value="aprovado">Aprovados</SelectItem>
                        <SelectItem value="rejeitado">Rejeitados</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={ordenar} onValueChange={setOrdenar}>
                    <SelectTrigger className="w-full sm:w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recentes">Mais recentes</SelectItem>
                        <SelectItem value="nome">Nome (A-Z)</SelectItem>
                        <SelectItem value="idade">Idade (maior)</SelectItem>
                        <SelectItem value="sexo">Sexo</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                {visiveis.map(s => (
                    <Card key={s.id}>
                        <CardContent className="p-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="font-semibold">{s.nome}</span>
                                        <Badge className={STATUS_BADGE[s.status] || ''}>{s.status}</Badge>
                                        {s.planoPretendido && <span className="text-xs text-primary font-semibold">{s.planoPretendido}</span>}
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                        {s.telefone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{s.telefone}</span>}
                                        {s.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{s.email}</span>}
                                        {(s.sexo || s.idade) && <span className="flex items-center gap-1"><User className="w-3 h-3" />{[s.sexo, s.idade ? s.idade + ' anos' : null].filter(Boolean).join(', ')}</span>}
                                        {s.dataCriacao && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(s.dataCriacao).toLocaleDateString('pt-PT')}</span>}
                                    </div>
                                    {s.mensagem && <p className="text-sm mt-2 text-muted-foreground">"{s.mensagem}"</p>}
                                    {s.revistoPor && <p className="text-xs mt-1 text-muted-foreground">Revisto por: {s.revistoPor}</p>}
                                </div>
                                <div className="flex flex-col gap-1 shrink-0">
                                    {s.status === 'aprovado' ? (
                                        <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                                            <Check className="w-4 h-4" /> Inscrito
                                        </span>
                                    ) : (
                                        <>
                                            <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={() => aprovarEInscrever(s)}>
                                                <Check className="w-4 h-4" /> Aprovar e inscrever
                                            </Button>
                                            {s.status === 'pendente' && (
                                                <Button size="sm" variant="outline" className="gap-1" onClick={() => mudarEstado(s.id, 'rejeitado')}>
                                                    <X className="w-4 h-4" /> Rejeitar
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive self-end" onClick={() => setDeleteTarget({ id: s.id, label: s.nome })}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {visiveis.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">
                        {items.length === 0
                            ? 'Nenhum pedido de inscrição.'
                            : busca.trim()
                                ? 'Nenhum pedido corresponde à pesquisa.'
                                : filtro === 'pendente'
                                    ? 'Nenhum pedido pendente. Os aprovados já são membros em Clientes.'
                                    : 'Nenhum pedido neste estado.'}
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar pedido?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Eliminar o pedido de <strong>{deleteTarget?.label}</strong>? Esta acção não pode ser revertida.
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
