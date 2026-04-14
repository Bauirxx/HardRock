import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, User, Phone, Mail, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTenantId } from '@/lib/tenantStore';
import moment from 'moment';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserCheck, Star, ShieldAlert } from 'lucide-react';

export default function AdminClients() {
    const [clients, setClients] = useState([]);
    const [externalUsers, setExternalUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [form, setForm] = useState({ nome: '', email: '', telefone: '', bi_numero: '', endereco: '', status: 'active', notas: '' });
    const { toast } = useToast();

    useEffect(() => { 
        loadClients();
        loadExternalUsers();
    }, []);

    const loadClients = async () => {
        const data = await base44.entities.Client.list('-created_date', 100);
        setClients(data);
        setLoading(false);
    };

    const loadExternalUsers = async () => {
        // Fetch all users who are not yet internal members
        const users = await base44.entities.User.filter({ role: 'external_client' });
        setExternalUsers(users);
    };

    const handleSave = async () => {
        if (editingClient) {
            await base44.entities.Client.update(editingClient.id, form);
            toast({ title: "Membro atualizado" });
        } else {
            await base44.entities.Client.create({ ...form, tenant_id: getCurrentTenantId() || 'default' });
            toast({ title: "Membro criado" });
        }
        setDialogOpen(false);
        setEditingClient(null);
        setForm({ nome: '', email: '', telefone: '', bi_numero: '', endereco: '', status: 'active', notas: '' });
        loadClients();
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setForm({
            nome: client.nome || '', email: client.email || '', telefone: client.telefone || '',
            bi_numero: client.bi_numero || '', endereco: client.endereco || '',
            status: client.status || 'active', notas: client.notas || ''
        });
        setDialogOpen(true);
    };

    const handlePromote = async (user) => {
        try {
            const tenantId = getCurrentTenantId() || 'default';
            await base44.users.promoteUser(user.id, tenantId);
            toast({ 
                title: "Utilizador Promovido!", 
                description: `${user.full_name} agora é membro oficial. Email de boas-vindas enviado.` 
            });
            loadClients();
            loadExternalUsers();
        } catch (error) {
            toast({ variant: "destructive", title: "Erro na promoção", description: error.message });
        }
    };

    const handleDelete = async (id) => {
        await base44.entities.Client.delete(id);
        toast({ title: "Registo removido" });
        loadClients();
    };

    const filteredClients = clients.filter(c =>
        c.nome?.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.telefone?.includes(search)
    );

    const filteredUsers = externalUsers.filter(u =>
        u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-space font-bold text-white tracking-tighter uppercase italic">
                        Gestão de <span className="text-primary">Membros</span>
                    </h1>
                    <p className="text-slate-400 text-sm">Controle de acesso e ativação de contas Hard Rock Gym.</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) { setEditingClient(null); setForm({ nome: '', email: '', telefone: '', bi_numero: '', endereco: '', status: 'active', notas: '' }); } }}>
                    <DialogTrigger asChild>
                        <Button className="gap-2 bg-primary hover:bg-red-700 font-bold"><Plus className="w-4 h-4" /> Adicionar Manualmente</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg bg-slate-900 border-slate-800 text-white">
                        <DialogHeader><DialogTitle className="text-white text-xl font-space">Ficha de Membro</DialogTitle></DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label className="text-slate-400">Nome *</Label><Input className="bg-slate-800 border-slate-700" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
                                <div className="space-y-2"><Label className="text-slate-400">Telefone *</Label><Input className="bg-slate-800 border-slate-700" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} /></div>
                            </div>
                            <div className="space-y-2"><Label className="text-slate-400">Email (Acesso App) *</Label><Input className="bg-slate-800 border-slate-700" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2"><Label className="text-slate-400">BI / Documento</Label><Input className="bg-slate-800 border-slate-700" value={form.bi_numero} onChange={e => setForm({ ...form, bi_numero: e.target.value })} /></div>
                                <div className="space-y-2">
                                    <Label className="text-slate-400">Estado</Label>
                                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                        <SelectTrigger className="bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-slate-900 border-slate-800 text-white">
                                            <SelectItem value="active">Activo</SelectItem>
                                            <SelectItem value="inactive">Inactivo</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleSave} className="w-full bg-primary font-bold">{editingClient ? 'Atualizar Membro' : 'Atestar Novo Membro'}</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input placeholder="Pesquisar por nome ou email..." className="pl-10 bg-slate-900 border-slate-800 text-white" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <Tabs defaultValue="internal" className="w-full">
                <TabsList className="bg-slate-900 border-slate-800">
                    <TabsTrigger value="internal" className="gap-2 data-[state=active]:bg-primary">Membros Internos ({clients.length})</TabsTrigger>
                    <TabsTrigger value="external" className="gap-2 data-[state=active]:bg-primary">Registos App (Externos) ({externalUsers.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="internal" className="mt-6">
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/50">
                                        <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Nome do Membro</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Contacto</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-slate-400 hidden md:table-cell">Estado</th>
                                        <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map(client => (
                                        <tr key={client.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                                        <UserCheck className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-200">{client.nome}</p>
                                                        <p className="text-xs text-slate-500 font-mono">{client.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-slate-400 hidden sm:table-cell">{client.telefone}</td>
                                            <td className="p-4 hidden md:table-cell">
                                                <Badge variant="outline" className={
                                                    client.status === 'active' ? 'border-green-500/50 text-green-500 bg-green-500/10' :
                                                        client.status === 'suspended' ? 'border-red-500/50 text-red-500 bg-red-500/10' :
                                                            'border-yellow-500/50 text-yellow-500 bg-yellow-500/10'
                                                }>{client.status?.toUpperCase()}</Badge>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-800" onClick={() => handleEdit(client)}>
                                                        <Edit className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredClients.length === 0 && (
                                <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-2">
                                    <Star className="w-8 h-8 opacity-20" />
                                    <p>Nenhum membro ativo encontrado.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>

                <TabsContent value="external" className="mt-6">
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800 bg-slate-800/50">
                                        <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Utilizador Externo</th>
                                        <th className="text-left p-4 text-xs font-bold uppercase tracking-wider text-slate-400 hidden sm:table-cell">Email</th>
                                        <th className="text-right p-4 text-xs font-bold uppercase tracking-wider text-slate-400">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map(user => (
                                        <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors text-white">
                                            <td className="p-4 font-bold">{user.full_name || 'Anónimo'}</td>
                                            <td className="p-4 text-slate-400 hidden sm:table-cell font-mono">{user.email}</td>
                                            <td className="p-4 text-right">
                                                <Button 
                                                    size="sm" 
                                                    className="gap-2 bg-green-600 hover:bg-green-700 font-bold"
                                                    onClick={() => handlePromote(user)}
                                                >
                                                    <UserCheck className="w-4 h-4" /> Promover a Membro
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredUsers.length === 0 && (
                                <div className="text-center py-16 text-slate-500 flex flex-col items-center gap-2">
                                    <ShieldAlert className="w-8 h-8 opacity-20" />
                                    <p>Nenhum registo pendente de aprovação.</p>
                                </div>
                            )}
                        </div>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}