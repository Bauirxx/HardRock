import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import RequireRole from '../components/auth/RequireRole';
import Navbar from '../components/landing/Navbar';
import NotificationBell from '../components/NotificationBell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dumbbell, Calendar, Users, Clock, CheckCircle, XCircle,
    ChevronLeft, ChevronRight, Plus, Edit
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import moment from 'moment';

const SESSION_STATUS = {
    scheduled: { label: 'Agendada', color: 'bg-blue-500/15 text-blue-400 border-blue-500/30' },
    completed: { label: 'Concluída', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
    cancelled: { label: 'Cancelada', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
    missed: { label: 'Falhada', color: 'bg-gray-500/15 text-gray-400 border-gray-500/30' },
};

const emptySession = {
    client: '', data: new Date().toISOString().split('T')[0],
    hora_inicio: '07:00', hora_fim: '08:00',
    status: 'scheduled', notas: '', local: '',
};

function TrainerDashboardContent() {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [clients, setClients] = useState([]);
    const [subscriptions, setSubscriptions] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSession, setEditingSession] = useState(null);
    const [form, setForm] = useState(emptySession);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const { toast } = useToast();

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const me = await base44.auth.me();
        setUser(me);

        // Resolver o perfil de Personal Trainer desta conta (o id do PT difere do id do user)
        const ptPerfil = await base44.trainers.me().catch(() => null);
        const ptId = ptPerfil?.id;

        const [sess, subs] = await Promise.all([
            base44.sessions.list({ trainer_id: me.id }).catch(() => []),
            ptId ? base44.subscriptions.list({ trainer_id: ptId }).catch(() => []) : Promise.resolve([]),
        ]);
        setSessions(sess);
        setSubscriptions(subs);

        // Alunos atribuídos ao trainer (clientes com personal_trainer_id = ptId)
        let alunos = [];
        if (ptId) {
            alunos = await base44.trainers.students(ptId).catch(() => []);
        }
        // Completar com clientes referidos em sessões/subscrições (compatibilidade)
        const extraIds = new Set([
            ...sess.map(s => s.client).filter(Boolean),
            ...subs.map(s => s.client).filter(Boolean),
        ]);
        const jaTem = new Set(alunos.map(c => c.id));
        const faltam = [...extraIds].filter(id => !jaTem.has(id));
        if (faltam.length > 0) {
            const allClients = await base44.entities.Client.list('-created_date', 200).catch(() => []);
            alunos = [...alunos, ...allClients.filter(c => faltam.includes(c.id))];
        }
        setClients(alunos);
    };

    const sessionsForDate = sessions.filter(s => s.data === selectedDate);

    const getDayHasSessions = (day) => sessions.some(s => s.data === moment(day).format('YYYY-MM-DD'));

    const calendarDays = () => {
        const start = moment(calendarDate).startOf('month');
        const end = moment(calendarDate).endOf('month');
        const days = [];
        for (let i = 0; i < start.day(); i++) days.push(null);
        for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, 'day')) days.push(d.clone());
        return days;
    };

    const handleSaveSession = async () => {
        if (!form.client || !form.data) {
            toast({ variant: 'destructive', title: 'Cliente e data são obrigatórios.' }); return;
        }
        try {
            const payload = { ...form, trainer: user?.id };
            if (editingSession) {
                await base44.sessions.update(editingSession.id, payload);
                toast({ title: 'Sessão atualizada' });
            } else {
                await base44.sessions.create(payload);
                toast({ title: 'Sessão agendada!' });
            }
            setDialogOpen(false);
            setEditingSession(null);
            setForm(emptySession);
            loadData();
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await base44.sessions.update(id, { status });
            setSessions(prev => prev.map(s => s.id === id ? { ...s, status } : s));
            toast({ title: 'Estado atualizado' });
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        }
    };

    const handleEditSession = (s) => {
        setEditingSession(s);
        setForm({ client: s.client || '', data: s.data || '', hora_inicio: s.hora_inicio || '07:00', hora_fim: s.hora_fim || '08:00', status: s.status || 'scheduled', notas: s.notas || '', local: s.local || '' });
        setDialogOpen(true);
    };

    const stats = {
        total: sessions.length,
        completed: sessions.filter(s => s.status === 'completed').length,
        upcoming: sessions.filter(s => s.status === 'scheduled' && new Date(s.data) >= new Date()).length,
        clients: clients.length,
    };

    const SessionDialog = (
        <Dialog open={dialogOpen} onOpenChange={open => { setDialogOpen(open); if (!open) { setEditingSession(null); setForm(emptySession); } }}>
            <DialogContent className="max-w-md">
                <DialogHeader><DialogTitle>{editingSession ? 'Editar' : 'Nova'} Sessão</DialogTitle></DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label>Cliente *</Label>
                        <Select value={form.client} onValueChange={v => setForm({ ...form, client: v })}>
                            <SelectTrigger><SelectValue placeholder="Escolher cliente..." /></SelectTrigger>
                            <SelectContent>
                                {clients.map(c => <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div><Label>Data *</Label>
                        <Input type="date" value={form.data} onChange={e => setForm({ ...form, data: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div><Label>Hora Início</Label><Input type="time" value={form.hora_inicio} onChange={e => setForm({ ...form, hora_inicio: e.target.value })} /></div>
                        <div><Label>Hora Fim</Label><Input type="time" value={form.hora_fim} onChange={e => setForm({ ...form, hora_fim: e.target.value })} /></div>
                    </div>
                    <div><Label>Local</Label><Input placeholder="Ex: Sala A, Área de pesos..." value={form.local} onChange={e => setForm({ ...form, local: e.target.value })} /></div>
                    {editingSession && (
                        <div><Label>Estado</Label>
                            <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {Object.entries(SESSION_STATUS).map(([k, v]) => <SelectItem key={k} value={k}>{v.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    <div><Label>Notas</Label><Textarea value={form.notas} onChange={e => setForm({ ...form, notas: e.target.value })} rows={3} /></div>
                    <Button className="w-full" onClick={handleSaveSession}>{editingSession ? 'Atualizar' : 'Agendar'} Sessão</Button>
                </div>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Navbar />
            <main className="pt-20 pb-16">
                <div className="bg-gradient-to-r from-black via-zinc-900 to-black px-4 sm:px-6 lg:px-8 py-10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent pointer-events-none" />
                    <div className="max-w-6xl mx-auto flex items-center gap-5 relative z-10">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 ring-2 ring-primary/40 overflow-hidden">
                            {user?.foto_url ? <img src={user.foto_url} alt="" className="w-full h-full object-cover" /> : <Dumbbell className="w-8 h-8 text-primary" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-primary text-sm font-semibold tracking-widest uppercase">Painel do Trainer</p>
                            <h1 className="text-2xl font-space font-bold text-white">{user?.full_name || 'Trainer'}</h1>
                            <p className="text-zinc-400 text-sm">{user?.especialidade || 'Personal Trainer'}</p>
                        </div>
                        {user && <NotificationBell userId={user.id} />}
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: 'Total Sessões', value: stats.total, icon: Calendar, color: 'text-primary' },
                            { label: 'Concluídas', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
                            { label: 'Próximas', value: stats.upcoming, icon: Clock, color: 'text-blue-400' },
                            { label: 'Clientes', value: stats.clients, icon: Users, color: 'text-purple-400' },
                        ].map((s, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                                <Card><CardContent className="p-5 flex items-center gap-3">
                                    <div className={`w-11 h-11 rounded-xl bg-muted flex items-center justify-center ${s.color}`}><s.icon className="w-5 h-5" /></div>
                                    <div><p className="text-xs text-muted-foreground">{s.label}</p><p className="text-2xl font-bold font-space">{s.value}</p></div>
                                </CardContent></Card>
                            </motion.div>
                        ))}
                    </div>

                    <Tabs defaultValue="calendar" className="w-full">
                        <TabsList className="mb-6 flex-wrap h-auto gap-1">
                            <TabsTrigger value="calendar" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"><Calendar className="w-4 h-4" /> Calendário</TabsTrigger>
                            <TabsTrigger value="clients" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"><Users className="w-4 h-4" /> Clientes</TabsTrigger>
                            <TabsTrigger value="sessions" className="gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-white"><Dumbbell className="w-4 h-4" /> Sessões</TabsTrigger>
                        </TabsList>

                        <TabsContent value="calendar" className="space-y-6">
                            <div className="grid lg:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <button onClick={() => setCalendarDate(d => { const n = new Date(d); n.setMonth(n.getMonth() - 1); return n; })} className="p-1 rounded hover:bg-muted"><ChevronLeft className="w-4 h-4" /></button>
                                            <span className="font-semibold text-sm capitalize">{moment(calendarDate).format('MMMM YYYY')}</span>
                                            <button onClick={() => setCalendarDate(d => { const n = new Date(d); n.setMonth(n.getMonth() + 1); return n; })} className="p-1 rounded hover:bg-muted"><ChevronRight className="w-4 h-4" /></button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-7 gap-0.5 text-center">
                                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => <div key={i} className="text-xs text-muted-foreground py-1">{d}</div>)}
                                            {calendarDays().map((day, i) => (
                                                <div key={i} className="aspect-square">
                                                    {day ? (
                                                        <button onClick={() => setSelectedDate(day.format('YYYY-MM-DD'))}
                                                            className={`w-full h-full rounded-lg text-xs font-medium transition-colors flex flex-col items-center justify-center gap-0.5
                                                                ${day.format('YYYY-MM-DD') === selectedDate ? 'bg-primary text-white' :
                                                                day.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD') ? 'border border-primary/50 text-primary' :
                                                                'hover:bg-muted'}`}>
                                                            {day.date()}
                                                            {getDayHasSessions(day) && <span className="w-1 h-1 rounded-full bg-primary" />}
                                                        </button>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="lg:col-span-2">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">Sessões — {moment(selectedDate).format('DD [de] MMMM')}</CardTitle>
                                            <Button size="sm" className="gap-1" onClick={() => setDialogOpen(true)}><Plus className="w-3 h-3" /> Agendar</Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {sessionsForDate.length === 0 ? (
                                            <div className="text-center py-10 text-muted-foreground">
                                                <Calendar className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                                <p className="text-sm">Nenhuma sessão para este dia.</p>
                                            </div>
                                        ) : sessionsForDate.map(s => {
                                            const st = SESSION_STATUS[s.status] || SESSION_STATUS.scheduled;
                                            const clientName = clients.find(c => c.id === s.client)?.nome || s.client_nome || 'Cliente';
                                            return (
                                                <div key={s.id} className="flex items-start gap-3 p-3 rounded-xl border hover:bg-muted/30 transition-colors mb-2">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0"><Clock className="w-4 h-4 text-primary" /></div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <p className="font-semibold text-sm">{clientName}</p>
                                                            <Badge className={`text-xs border ${st.color}`}>{st.label}</Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{s.hora_inicio}{s.hora_fim ? ` — ${s.hora_fim}` : ''}{s.local ? ` · ${s.local}` : ''}</p>
                                                        {s.notas && <p className="text-xs text-muted-foreground/70 mt-1 line-clamp-2">{s.notas}</p>}
                                                        {s.status === 'scheduled' && (
                                                            <div className="flex gap-2 mt-2">
                                                                <button onClick={() => handleStatusChange(s.id, 'completed')} className="text-xs text-green-400 hover:underline flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Concluir</button>
                                                                <button onClick={() => handleStatusChange(s.id, 'cancelled')} className="text-xs text-red-400 hover:underline flex items-center gap-1"><XCircle className="w-3 h-3" /> Cancelar</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button onClick={() => handleEditSession(s)} className="text-muted-foreground hover:text-foreground"><Edit className="w-3.5 h-3.5" /></button>
                                                </div>
                                            );
                                        })}
                                    </CardContent>
                                </Card>
                            </div>
                            {SessionDialog}
                        </TabsContent>

                        <TabsContent value="clients">
                            {clients.length === 0 ? (
                                <div className="text-center py-16 text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>Nenhum cliente atribuído.</p></div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {clients.map(client => {
                                        const activeSub = subscriptions.find(s => s.client === client.id && s.status === 'active');
                                        const clientSessions = sessions.filter(s => s.client === client.id);
                                        return (
                                            <Card key={client.id} className="hover:shadow-md transition-shadow">
                                                <CardContent className="p-5">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                            {client.foto_url ? <img src={client.foto_url} alt={client.nome} className="w-full h-full object-cover" /> : <span className="font-bold text-primary">{client.nome?.charAt(0)}</span>}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold truncate">{client.nome}</h3>
                                                            <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 text-sm">
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Plano</span>
                                                            {activeSub ? <Badge className="bg-green-500/15 text-green-400 text-xs">{activeSub.service_nome || 'Ativo'}</Badge> : <Badge variant="outline" className="text-xs">Sem plano</Badge>}
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span className="text-muted-foreground">Sessões</span>
                                                            <span className="font-medium">{clientSessions.filter(s => s.status === 'completed').length}/{clientSessions.length}</span>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="sessions">
                            <Card>
                                <CardContent className="p-4">
                                    {sessions.length === 0 ? <p className="text-center text-muted-foreground py-8">Nenhuma sessão registada.</p> : (
                                        <div className="space-y-2">
                                            {sessions.slice(0, 50).map(s => {
                                                const st = SESSION_STATUS[s.status] || SESSION_STATUS.scheduled;
                                                const clientName = clients.find(c => c.id === s.client)?.nome || s.client_nome || 'Cliente';
                                                return (
                                                    <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border hover:bg-muted/30">
                                                        <div className="text-center w-12 flex-shrink-0">
                                                            <p className="text-sm font-bold">{moment(s.data).format('DD')}</p>
                                                            <p className="text-xs text-muted-foreground">{moment(s.data).format('MMM')}</p>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-medium text-sm truncate">{clientName}</p>
                                                            <p className="text-xs text-muted-foreground">{s.hora_inicio} — {s.local || 'Ginásio'}</p>
                                                        </div>
                                                        <Badge className={`text-xs border ${st.color} flex-shrink-0`}>{st.label}</Badge>
                                                        {s.status === 'scheduled' && (
                                                            <button onClick={() => handleStatusChange(s.id, 'completed')} className="text-green-400 hover:text-green-300"><CheckCircle className="w-4 h-4" /></button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}

export default function TrainerDashboard() {
    return (
        <RequireRole roles={['personal_trainer', 'admin', 'staff']}>
            <TrainerDashboardContent />
        </RequireRole>
    );
}
