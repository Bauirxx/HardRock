import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Dumbbell, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTenantId } from '@/lib/tenantStore';

const emptyForm = { nome: '', descricao: '', preco_mensal: '', preco_trimestral: '', preco_anual: '', status: 'active', destaque: false };

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const { toast } = useToast();

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        const data = await base44.entities.Service.list('-created_date', 50);
        setServices(data);
        setLoading(false);
    };

    const handleSave = async () => {
        const payload = {
            ...form,
            preco_mensal: parseFloat(form.preco_mensal) || 0,
            preco_trimestral: form.preco_trimestral ? parseFloat(form.preco_trimestral) : undefined,
            preco_anual: form.preco_anual ? parseFloat(form.preco_anual) : undefined,
            tenant_id: getCurrentTenantId() || 'default',
        };
        if (editing) {
            await base44.entities.Service.update(editing.id, payload);
            toast({ title: "Serviço atualizado" });
        } else {
            await base44.entities.Service.create(payload);
            toast({ title: "Serviço criado" });
        }
        setDialogOpen(false);
        setEditing(null);
        setForm(emptyForm);
        loadServices();
    };

    const handleEdit = (s) => {
        setEditing(s);
        setForm({
            nome: s.nome || '', descricao: s.descricao || '',
            preco_mensal: s.preco_mensal?.toString() || '',
            preco_trimestral: s.preco_trimestral?.toString() || '',
            preco_anual: s.preco_anual?.toString() || '',
            status: s.status || 'active', destaque: s.destaque || false,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        await base44.entities.Service.delete(id);
        toast({ title: "Serviço removido" });
        loadServices();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Serviços</h1>
                    <p className="text-muted-foreground text-sm">{services.length} serviços</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) { setEditing(null); setForm(emptyForm); } }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Novo Serviço</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Novo'} Serviço</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
                            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>
                            <div className="grid grid-cols-3 gap-3">
                                <div><Label>Mensal (MZN) *</Label><Input type="number" value={form.preco_mensal} onChange={e => setForm({ ...form, preco_mensal: e.target.value })} /></div>
                                <div><Label>Trimestral</Label><Input type="number" value={form.preco_trimestral} onChange={e => setForm({ ...form, preco_trimestral: e.target.value })} /></div>
                                <div><Label>Anual</Label><Input type="number" value={form.preco_anual} onChange={e => setForm({ ...form, preco_anual: e.target.value })} /></div>
                            </div>
                            <div className="flex items-center gap-2"><Switch checked={form.destaque} onCheckedChange={v => setForm({ ...form, destaque: v })} /><Label>Destaque</Label></div>
                            <Button onClick={handleSave} className="w-full">{editing ? 'Atualizar' : 'Criar'} Serviço</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(s => (
                    <Card key={s.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Dumbbell className="w-5 h-5 text-primary" />
                                </div>
                                {s.destaque && <Badge>Destaque</Badge>}
                            </div>
                            <h3 className="font-space font-semibold text-lg mb-1">{s.nome}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{s.descricao}</p>
                            <p className="text-2xl font-bold text-primary">{s.preco_mensal?.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">MZN/mês</span></p>
                            <div className="flex gap-1 mt-4">
                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(s)}>
                                    <Edit className="w-3 h-3" /> Editar
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {services.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum serviço criado.</div>
                )}
            </div>
        </div>
    );
}