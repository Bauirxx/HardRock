import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Trash2, Phone, Mail, Clock } from 'lucide-react';
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
    const [filtro, setFiltro] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { toast } = useToast();

    useEffect(() => { loadData(); }, [filtro]);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = filtro
                ? await base44.entities.GymApplication.filter({ status: filtro, size: 100 })
                : await base44.entities.GymApplication.list('-created_date', 100);
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

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Pedidos de Inscrição</h1>
                    <p className="text-muted-foreground text-sm">{items.length} pedidos · {pendentes} pendentes</p>
                </div>
                <Select value={filtro || 'todos'} onValueChange={v => setFiltro(v === 'todos' ? '' : v)}>
                    <SelectTrigger className="w-40"><SelectValue placeholder="Todos" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        <SelectItem value="pendente">Pendentes</SelectItem>
                        <SelectItem value="aprovado">Aprovados</SelectItem>
                        <SelectItem value="rejeitado">Rejeitados</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-3">
                {items.map(s => (
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
                                        {s.dataCriacao && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(s.dataCriacao).toLocaleDateString('pt-PT')}</span>}
                                    </div>
                                    {s.mensagem && <p className="text-sm mt-2 text-muted-foreground">"{s.mensagem}"</p>}
                                    {s.revistoPor && <p className="text-xs mt-1 text-muted-foreground">Revisto por: {s.revistoPor}</p>}
                                </div>
                                <div className="flex flex-col gap-1 shrink-0">
                                    {s.status !== 'aprovado' && (
                                        <Button size="sm" className="gap-1 bg-green-600 hover:bg-green-700" onClick={() => aprovarEInscrever(s)}>
                                            <Check className="w-4 h-4" /> Aprovar e inscrever
                                        </Button>
                                    )}
                                    {s.status !== 'rejeitado' && (
                                        <Button size="sm" variant="outline" className="gap-1" onClick={() => mudarEstado(s.id, 'rejeitado')}>
                                            <X className="w-4 h-4" /> Rejeitar
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive self-end" onClick={() => setDeleteTarget({ id: s.id, label: s.nome })}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {items.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">Nenhum pedido de inscrição.</div>
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
