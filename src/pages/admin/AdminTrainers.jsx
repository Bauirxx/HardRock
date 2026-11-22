import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Dumbbell, Clock, Edit, Mail, CalendarPlus, Users, KeyRound, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const emptyForm = {
    full_name: '', email: '', especialidade: '', bio: '',
    disponibilidade: '', telefone: '', status: 'active', foto_url: '',
};

const emptySession = {
    client: '', trainer: '', data: new Date().toISOString().split('T')[0],
    hora_inicio: '07:00', hora_fim: '08:00', status: 'scheduled', notas: '', local: '',
};

export default function AdminTrainers() {
    const [trainers, setTrainers] = useState([]);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
    const [resetDialogOpen, setResetDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [resetTarget, setResetTarget] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [sessionForm, setSessionForm] = useState(emptySession);
    const [newPassword, setNewPassword] = useState('');
    const [uploadingFoto, setUploadingFoto] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadTrainers();
        base44.entities.Client.list('-created_date', 200).then(setClients).catch(() => {});
    }, []);

    const loadTrainers = async () => {
        const users = await base44.entities.User.filter({ role: 'personal_trainer' });
        setTrainers(users);
        setLoading(false);
    };

    const handleFotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploadingFoto(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setForm(prev => ({ ...prev, foto_url: file_url }));
            toast({ title: 'Foto carregada!' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro no upload', description: err.message });
        } finally { setUploadingFoto(false); }
    };

    const handleSave = async () => {
        if (editing) {
            try {
                await base44.entities.User.update(editing.id, {
                    full_name: form.full_name,
                    especialidade: form.especialidade,
                    bio: form.bio,
                    disponibilidade: form.disponibilidade,
                    telefone: form.telefone,
                    foto_url: form.foto_url || null,
                    status: form.status,
                });
                toast({ title: "Trainer atualizado" });
                setDialogOpen(false);
                setEditing(null);
                setForm(emptyForm);
                loadTrainers();
            } catch (err) {
                toast({ variant: 'destructive', title: 'Erro', description: err.message });
            }
        }
    };

    const handleCreateTrainer = async () => {
        if (!form.email || !form.full_name) {
            toast({ variant: 'destructive', title: 'Nome e email são obrigatórios.' });
            return;
        }
        try {
            const res = await base44.admin.createInternalClient({
                email: form.email,
                nome: form.full_name,
                telefone: form.telefone,
                foto_url: form.foto_url || null,
                especialidade: form.especialidade,
                bio: form.bio,
                disponibilidade: form.disponibilidade,
                role: 'personal_trainer',
            });
            toast({ title: 'Trainer criado!', description: `Credenciais enviadas para ${form.email}.` });
            if (res.dev_password) toast({ title: `Dev: senha = ${res.dev_password}` });
            setDialogOpen(false);
            setForm(emptyForm);
            loadTrainers();
        } catch (err) {
            let msg = err.message;
            try { msg = Object.values(JSON.parse(msg)).flat().join(' '); } catch { /* keep raw */ }
            toast({ variant: 'destructive', title: 'Erro ao criar trainer', description: msg });
        }
    };

    const handleEdit = (trainer) => {
        setEditing(trainer);
        setForm({
            full_name: trainer.full_name || '',
            email: trainer.email || '',
            especialidade: trainer.especialidade || '',
            bio: trainer.bio || '',
            disponibilidade: trainer.disponibilidade || '',
            telefone: trainer.telefone || '',
            status: trainer.status || 'active',
            foto_url: trainer.foto_url || '',
        });
        setDialogOpen(true);
    };

    const handleResetPassword = async () => {
        if (!resetTarget || newPassword.length < 6) {
            toast({ variant: 'destructive', title: 'Senha deve ter pelo menos 6 caracteres.' });
            return;
        }
        try {
            const res = await base44.admin.resetPassword(resetTarget.id, newPassword);
            toast({ title: 'Senha redefinida!', description: `Email enviado para ${resetTarget.email}` });
            if (res.dev_password) toast({ title: `Dev: nova senha = ${res.dev_password}` });
            setResetDialogOpen(false);
            setNewPassword('');
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        }
    };

    const handleCreateSession = async () => {
        if (!sessionForm.client || !sessionForm.trainer || !sessionForm.data) {
            toast({ variant: 'destructive', title: 'Cliente, trainer e data são obrigatórios.' });
            return;
        }
        try {
            await base44.sessions.create(sessionForm);
            toast({ title: 'Sessão agendada!' });
            setSessionDialogOpen(false);
            setSessionForm(emptySession);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Personal Trainers</h1>
                    <p className="text-muted-foreground text-sm">{trainers.length} treinadores registados</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {/* Schedule Session dialog */}
                    <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2"><CalendarPlus className="w-4 h-4" /> Agendar Sessão</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader><DialogTitle>Agendar Sessão de Treino</DialogTitle></DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label>Cliente *</Label>
                                    <Select value={sessionForm.client} onValueChange={v => setSessionForm({ ...sessionForm, client: v })}>
                                        <SelectTrigger><SelectValue placeholder="Escolher cliente..." /></SelectTrigger>
                                        <SelectContent>
                                            {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Trainer *</Label>
                                    <Select value={sessionForm.trainer} onValueChange={v => setSessionForm({ ...sessionForm, trainer: v })}>
                                        <SelectTrigger><SelectValue placeholder="Escolher trainer..." /></SelectTrigger>
                                        <SelectContent>
                                            {trainers.map(t => <SelectItem key={t.id} value={t.id}>{t.full_name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Data *</Label>
                                    <Input type="date" value={sessionForm.data} onChange={e => setSessionForm({ ...sessionForm, data: e.target.value })} />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label>Hora Início</Label>
                                        <Input type="time" value={sessionForm.hora_inicio} onChange={e => setSessionForm({ ...sessionForm, hora_inicio: e.target.value })} />
                                    </div>
                                    <div>
                                        <Label>Hora Fim</Label>
                                        <Input type="time" value={sessionForm.hora_fim} onChange={e => setSessionForm({ ...sessionForm, hora_fim: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <Label>Local</Label>
                                    <Input placeholder="Ex: Sala A, Área de pesos..." value={sessionForm.local} onChange={e => setSessionForm({ ...sessionForm, local: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Notas</Label>
                                    <Textarea placeholder="Observações sobre a sessão..." value={sessionForm.notas} onChange={e => setSessionForm({ ...sessionForm, notas: e.target.value })} rows={2} />
                                </div>
                                <Button className="w-full" onClick={handleCreateSession}>Agendar Sessão</Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Add/Edit Trainer dialog */}
                    <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) { setEditing(null); setForm(emptyForm); } }}>
                        <DialogTrigger asChild>
                            <Button className="gap-2"><Plus className="w-4 h-4" /> Adicionar Trainer</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editing ? 'Editar Trainer' : 'Novo Personal Trainer'}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                                {/* Foto */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                                        {form.foto_url ? (
                                            <img src={form.foto_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <Dumbbell className="w-8 h-8 text-muted-foreground" />
                                        )}
                                    </div>
                                    <label className="cursor-pointer">
                                        <Button type="button" variant="outline" size="sm" className="gap-2" asChild>
                                            <span>{uploadingFoto ? 'A carregar...' : <><Upload className="w-3 h-3" /> Foto de Perfil</>}</span>
                                        </Button>
                                        <input type="file" accept="image/*" className="hidden" onChange={handleFotoUpload} disabled={uploadingFoto} />
                                    </label>
                                </div>

                                {!editing && (
                                    <div><Label>Email *</Label>
                                        <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="trainer@email.com" />
                                        <p className="text-xs text-muted-foreground mt-1">Receberá credenciais de acesso por email.</p>
                                    </div>
                                )}
                                <div><Label>Nome Completo *</Label>
                                    <Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
                                </div>
                                <div><Label>Especialidade</Label>
                                    <Input value={form.especialidade} onChange={e => setForm({ ...form, especialidade: e.target.value })} placeholder="Ex: Musculação, CrossFit, Yoga..." />
                                </div>
                                <div><Label>Telefone</Label>
                                    <Input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                                </div>
                                <div><Label>Disponibilidade</Label>
                                    <Input value={form.disponibilidade} onChange={e => setForm({ ...form, disponibilidade: e.target.value })} placeholder="Ex: Seg-Sex 7h-19h" />
                                </div>
                                <div><Label>Biografia</Label>
                                    <Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Breve descrição do trainer..." />
                                </div>
                                {editing && (
                                    <div><Label>Estado</Label>
                                        <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Activo</SelectItem>
                                                <SelectItem value="inactive">Inactivo</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <Button onClick={editing ? handleSave : handleCreateTrainer} className="w-full">
                                    {editing ? 'Guardar Alterações' : 'Criar & Enviar Credenciais'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Reset Password dialog */}
            <Dialog open={resetDialogOpen} onOpenChange={open => { setResetDialogOpen(open); if (!open) setNewPassword(''); }}>
                <DialogContent className="max-w-sm">
                    <DialogHeader><DialogTitle>Redefinir Senha</DialogTitle></DialogHeader>
                    <p className="text-sm text-muted-foreground">{resetTarget?.full_name} — {resetTarget?.email}</p>
                    <div className="space-y-3">
                        <div><Label>Nova Senha</Label>
                            <Input type="text" placeholder="Mínimo 6 caracteres" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                            <p className="text-xs text-muted-foreground mt-1">Deixe em branco para gerar automaticamente.</p>
                        </div>
                        <Button className="w-full" onClick={handleResetPassword}>Redefinir & Enviar Email</Button>
                    </div>
                </DialogContent>
            </Dialog>

            {trainers.length === 0 && !loading ? (
                <div className="text-center py-20">
                    <Dumbbell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="font-space font-semibold mb-2">Nenhum Personal Trainer</h3>
                    <p className="text-muted-foreground text-sm mb-4">Adicione treinadores para a equipa.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trainers.map(trainer => (
                        <Card key={trainer.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        {trainer.foto_url ? (
                                            <img src={trainer.foto_url} alt={trainer.full_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-primary font-bold text-sm">
                                                {trainer.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{trainer.full_name}</h3>
                                        <p className="text-xs text-muted-foreground truncate">{trainer.email}</p>
                                        <Badge variant="outline" className={`mt-1 text-xs ${trainer.status === 'active' ? 'border-green-500/30 text-green-400' : 'border-red-500/30 text-red-400'}`}>
                                            {trainer.status === 'active' ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>
                                </div>

                                {trainer.especialidade && (
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <Dumbbell className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-muted-foreground">{trainer.especialidade}</span>
                                    </div>
                                )}
                                {trainer.disponibilidade && (
                                    <div className="flex items-center gap-2 text-sm mb-2">
                                        <Clock className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-muted-foreground">{trainer.disponibilidade}</span>
                                    </div>
                                )}
                                {trainer.telefone && (
                                    <div className="flex items-center gap-2 text-sm mb-3">
                                        <Mail className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-muted-foreground">{trainer.telefone}</span>
                                    </div>
                                )}
                                {trainer.bio && (
                                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{trainer.bio}</p>
                                )}

                                <div className="flex gap-1">
                                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleEdit(trainer)}>
                                        <Edit className="w-3 h-3" /> Editar
                                    </Button>
                                    <Button variant="ghost" size="sm" className="gap-1 text-yellow-500" onClick={() => { setResetTarget(trainer); setResetDialogOpen(true); }}>
                                        <KeyRound className="w-3 h-3" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
