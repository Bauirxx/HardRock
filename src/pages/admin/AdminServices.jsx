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
import { Plus, Dumbbell, Edit, Trash2, Clock, Users, Star, X, Check } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTenantId } from '@/lib/tenantStore';

const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4', '#F97316'];

const emptyForm = {
    nome: '', descricao: '', preco_mensal: '', preco_trimestral: '', preco_anual: '',
    status: 'active', destaque: false, inclui_pt: false,
    sessoes_semanais: '3', duracao_minutos: '60',
    cor: '#10B981', max_alunos: '0',
    beneficios: [], horarios: [],
    _new_beneficio: '', _new_horario: '',
};

export default function AdminServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const { toast } = useToast();

    useEffect(() => { loadServices(); }, []);

    const loadServices = async () => {
        const data = await base44.entities.Service.list('-created_date', 50);
        setServices(data);
        setLoading(false);
    };

    const addBeneficio = () => {
        if (!form._new_beneficio.trim()) return;
        setForm(prev => ({ ...prev, beneficios: [...prev.beneficios, prev._new_beneficio.trim()], _new_beneficio: '' }));
    };

    const removeBeneficio = (i) => setForm(prev => ({ ...prev, beneficios: prev.beneficios.filter((_, idx) => idx !== i) }));

    const addHorario = () => {
        if (!form._new_horario.trim()) return;
        setForm(prev => ({ ...prev, horarios: [...prev.horarios, prev._new_horario.trim()], _new_horario: '' }));
    };

    const removeHorario = (i) => setForm(prev => ({ ...prev, horarios: prev.horarios.filter((_, idx) => idx !== i) }));

    const handleSave = async () => {
        const { _new_beneficio, _new_horario, ...rest } = form;
        const payload = {
            ...rest,
            preco_mensal: parseFloat(form.preco_mensal) || 0,
            preco_trimestral: form.preco_trimestral ? parseFloat(form.preco_trimestral) : null,
            preco_anual: form.preco_anual ? parseFloat(form.preco_anual) : null,
            sessoes_semanais: parseInt(form.sessoes_semanais) || 3,
            duracao_minutos: parseInt(form.duracao_minutos) || 60,
            max_alunos: parseInt(form.max_alunos) || 0,
            tenant_id: getCurrentTenantId() || null,
        };
        try {
            if (editing) {
                await base44.entities.Service.update(editing.id, payload);
                toast({ title: "Serviço atualizado" });
            } else {
                await base44.entities.Service.create(payload);
                toast({ title: "Serviço criado com sucesso" });
            }
            setDialogOpen(false);
            setEditing(null);
            setForm(emptyForm);
            loadServices();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro ao guardar', description: err.message });
        }
    };

    const handleEdit = (s) => {
        setEditing(s);
        setForm({
            nome: s.nome || '', descricao: s.descricao || '',
            preco_mensal: s.preco_mensal?.toString() || '',
            preco_trimestral: s.preco_trimestral?.toString() || '',
            preco_anual: s.preco_anual?.toString() || '',
            status: s.status || 'active', destaque: s.destaque || false,
            inclui_pt: s.inclui_pt || false,
            sessoes_semanais: s.sessoes_semanais?.toString() || '3',
            duracao_minutos: s.duracao_minutos?.toString() || '60',
            cor: s.cor || '#10B981',
            max_alunos: s.max_alunos?.toString() || '0',
            beneficios: s.beneficios || [],
            horarios: s.horarios || [],
            _new_beneficio: '', _new_horario: '',
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await base44.entities.Service.delete(id);
            toast({ title: "Serviço removido" });
            loadServices();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro ao remover', description: err.message });
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Planos & Serviços</h1>
                    <p className="text-muted-foreground text-sm">{services.length} planos disponíveis</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) { setEditing(null); setForm(emptyForm); } }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Novo Plano</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader><DialogTitle>{editing ? 'Editar' : 'Novo'} Plano</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div><Label>Nome *</Label><Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Ex: Plano Premium" /></div>
                            <div><Label>Descrição</Label><Textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={2} /></div>

                            <div className="grid grid-cols-3 gap-3">
                                <div><Label>Mensal (MZN) *</Label><Input type="number" value={form.preco_mensal} onChange={e => setForm({ ...form, preco_mensal: e.target.value })} /></div>
                                <div><Label>Trimestral</Label><Input type="number" value={form.preco_trimestral} onChange={e => setForm({ ...form, preco_trimestral: e.target.value })} /></div>
                                <div><Label>Anual</Label><Input type="number" value={form.preco_anual} onChange={e => setForm({ ...form, preco_anual: e.target.value })} /></div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                <div><Label>Sessões/Semana</Label><Input type="number" value={form.sessoes_semanais} onChange={e => setForm({ ...form, sessoes_semanais: e.target.value })} /></div>
                                <div><Label>Duração (min)</Label><Input type="number" value={form.duracao_minutos} onChange={e => setForm({ ...form, duracao_minutos: e.target.value })} /></div>
                                <div><Label>Max Alunos (0=∞)</Label><Input type="number" value={form.max_alunos} onChange={e => setForm({ ...form, max_alunos: e.target.value })} /></div>
                            </div>

                            <div>
                                <Label>Cor do Plano</Label>
                                <div className="flex gap-2 mt-1 flex-wrap">
                                    {COLORS.map(c => (
                                        <button key={c} onClick={() => setForm({ ...form, cor: c })}
                                            className="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center"
                                            style={{ backgroundColor: c, borderColor: form.cor === c ? 'white' : 'transparent' }}>
                                            {form.cor === c && <Check className="w-4 h-4 text-white" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label>Benefícios incluídos</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input placeholder="Ex: Acesso 24h" value={form._new_beneficio}
                                        onChange={e => setForm({ ...form, _new_beneficio: e.target.value })}
                                        onKeyDown={e => e.key === 'Enter' && addBeneficio()} />
                                    <Button type="button" variant="outline" size="icon" onClick={addBeneficio}><Plus className="w-4 h-4" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.beneficios.map((b, i) => (
                                        <Badge key={i} variant="secondary" className="gap-1">
                                            {b}
                                            <button onClick={() => removeBeneficio(i)}><X className="w-3 h-3" /></button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <Label>Horários Disponíveis</Label>
                                <div className="flex gap-2 mt-1">
                                    <Input placeholder="Ex: Seg/Qua/Sex 07h-08h" value={form._new_horario}
                                        onChange={e => setForm({ ...form, _new_horario: e.target.value })}
                                        onKeyDown={e => e.key === 'Enter' && addHorario()} />
                                    <Button type="button" variant="outline" size="icon" onClick={addHorario}><Plus className="w-4 h-4" /></Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {form.horarios.map((h, i) => (
                                        <Badge key={i} variant="outline" className="gap-1">
                                            <Clock className="w-3 h-3" /> {h}
                                            <button onClick={() => removeHorario(i)}><X className="w-3 h-3" /></button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-6">
                                <div className="flex items-center gap-2"><Switch checked={form.inclui_pt} onCheckedChange={v => setForm({ ...form, inclui_pt: v })} /><Label>Inclui Personal Trainer</Label></div>
                                <div className="flex items-center gap-2"><Switch checked={form.destaque} onCheckedChange={v => setForm({ ...form, destaque: v })} /><Label>Destaque</Label></div>
                            </div>

                            <Button onClick={handleSave} className="w-full">{editing ? 'Atualizar' : 'Criar'} Plano</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map(s => (
                    <Card key={s.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-1.5" style={{ backgroundColor: s.cor || '#10B981' }} />
                        <CardContent className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.cor || '#10B981'}20` }}>
                                    <Dumbbell className="w-5 h-5" style={{ color: s.cor || '#10B981' }} />
                                </div>
                                <div className="flex gap-1">
                                    {s.destaque && <Badge>Destaque</Badge>}
                                    {s.inclui_pt && <Badge variant="secondary">+PT</Badge>}
                                </div>
                            </div>
                            <h3 className="font-space font-semibold text-lg mb-1">{s.nome}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{s.descricao}</p>

                            <div className="flex gap-4 text-xs text-muted-foreground mb-3">
                                {s.sessoes_semanais > 0 && (
                                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.sessoes_semanais}x/sem</span>
                                )}
                                {s.max_alunos > 0 && (
                                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />Max {s.max_alunos}</span>
                                )}
                            </div>

                            {s.beneficios?.length > 0 && (
                                <ul className="text-xs text-muted-foreground mb-3 space-y-1">
                                    {s.beneficios.slice(0, 3).map((b, i) => (
                                        <li key={i} className="flex items-center gap-1">
                                            <Check className="w-3 h-3 text-green-400" />{b}
                                        </li>
                                    ))}
                                    {s.beneficios.length > 3 && <li className="text-xs opacity-60">+{s.beneficios.length - 3} mais...</li>}
                                </ul>
                            )}

                            <p className="text-2xl font-bold" style={{ color: s.cor || '#10B981' }}>
                                {parseFloat(s.preco_mensal || 0).toLocaleString()} <span className="text-sm font-normal text-muted-foreground">MZN/mês</span>
                            </p>

                            <div className="flex gap-1 mt-4">
                                <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(s)}>
                                    <Edit className="w-3 h-3" /> Editar
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => setDeleteTarget({ id: s.id, label: s.nome })}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {services.length === 0 && !loading && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">Nenhum plano criado ainda.</div>
                )}
            </div>

            <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar plano/serviço?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem a certeza que quer eliminar <strong>{deleteTarget?.label}</strong>? Esta acção não pode ser revertida.
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
