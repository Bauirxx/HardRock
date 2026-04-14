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
import { Plus, User, Dumbbell, Clock, Edit, Trash2, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTenantId } from '@/lib/tenantStore';

const emptyForm = {
    full_name: '', email: '', especialidade: '', bio: '',
    disponibilidade: '', telefone: '', status: 'active',
};

export default function AdminTrainers() {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const { toast } = useToast();

    useEffect(() => { loadTrainers(); }, []);

    const loadTrainers = async () => {
        const users = await base44.entities.User.filter({ role: 'personal_trainer' });
        setTrainers(users);
        setLoading(false);
    };

    const handleSave = async () => {
        if (editing) {
            await base44.auth.updateMe ? null : null;
            await base44.entities.User.update(editing.id, {
                especialidade: form.especialidade,
                bio: form.bio,
                disponibilidade: form.disponibilidade,
                telefone: form.telefone,
                status: form.status,
            });
            toast({ title: "Personal Trainer atualizado" });
        }
        setDialogOpen(false);
        setEditing(null);
        setForm(emptyForm);
        loadTrainers();
    };

    const handleInvite = async () => {
        if (!form.email) return;
        await base44.users.inviteUser(form.email, 'personal_trainer');
        toast({ title: "Convite enviado!", description: `${form.email} receberá um convite como Personal Trainer.` });
        setDialogOpen(false);
        setForm(emptyForm);
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
        });
        setDialogOpen(true);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Personal Trainers</h1>
                    <p className="text-muted-foreground text-sm">{trainers.length} treinadores registados</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) { setEditing(null); setForm(emptyForm); } }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Convidar Trainer</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Editar Trainer' : 'Convidar Personal Trainer'}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            {!editing && (
                                <div>
                                    <Label>Email *</Label>
                                    <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="trainer@email.com" />
                                    <p className="text-xs text-muted-foreground mt-1">O trainer receberá um convite por email.</p>
                                </div>
                            )}
                            <div>
                                <Label>Especialidade</Label>
                                <Input value={form.especialidade} onChange={e => setForm({ ...form, especialidade: e.target.value })} placeholder="Ex: Musculação, CrossFit, Yoga..." />
                            </div>
                            <div>
                                <Label>Telefone</Label>
                                <Input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                            </div>
                            <div>
                                <Label>Disponibilidade</Label>
                                <Input value={form.disponibilidade} onChange={e => setForm({ ...form, disponibilidade: e.target.value })} placeholder="Ex: Seg-Sex 7h-19h" />
                            </div>
                            <div>
                                <Label>Biografia</Label>
                                <Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} placeholder="Breve descrição do trainer..." />
                            </div>
                            {editing && (
                                <div>
                                    <Label>Estado</Label>
                                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="inactive">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                            <Button onClick={editing ? handleSave : handleInvite} className="w-full">
                                {editing ? 'Guardar Alterações' : 'Enviar Convite'}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {trainers.length === 0 && !loading ? (
                <div className="text-center py-20">
                    <Dumbbell className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
                    <h3 className="font-space font-semibold mb-2">Nenhum Personal Trainer</h3>
                    <p className="text-muted-foreground text-sm mb-4">Convide treinadores para se juntarem à equipa.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {trainers.map(trainer => (
                        <Card key={trainer.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-5">
                                <div className="flex items-start gap-3 mb-4">
                                    <Avatar className="h-12 w-12">
                                        {trainer.foto_url ? (
                                            <img src={trainer.foto_url} alt={trainer.full_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                {trainer.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{trainer.full_name}</h3>
                                        <p className="text-xs text-muted-foreground truncate">{trainer.email}</p>
                                        <Badge variant="outline" className={`mt-1 text-xs ${trainer.status === 'active' ? 'border-green-300 text-green-700' : 'border-red-300 text-red-700'}`}>
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

                                <Button variant="outline" size="sm" className="w-full gap-1" onClick={() => handleEdit(trainer)}>
                                    <Edit className="w-3 h-3" /> Editar
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}