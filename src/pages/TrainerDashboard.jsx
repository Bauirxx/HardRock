import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import RequireRole from '../components/auth/RequireRole';
import Navbar from '../components/landing/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Dumbbell, Clock, User, Star, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

function TrainerDashboardContent() {
    const [user, setUser] = useState(null);
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const me = await base44.auth.me();
        setUser(me);
        const allClients = await base44.entities.Client.list('-created_date', 50);
        setClients(allClients);
        setLoading(false);
    };

    const saveNotes = async (clientId, notas) => {
        await base44.entities.Client.update(clientId, { notas });
    };

    return (
        <div className="min-h-screen flex flex-col bg-muted/30">
            <Navbar />
            <main className="flex-1 pt-24 pb-16">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                                <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                    {user?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h1 className="text-2xl font-space font-bold">{user?.full_name}</h1>
                                    <Badge className="bg-primary/10 text-primary border-primary/20">Personal Trainer</Badge>
                                </div>
                                <p className="text-muted-foreground">{user?.especialidade || 'Trainer certificado'}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        {[
                            { icon: Users, label: 'Clientes', value: clients.length, color: 'text-blue-500', bg: 'bg-blue-50' },
                            { icon: CheckCircle, label: 'Activos', value: clients.filter(c => c.status === 'active').length, color: 'text-green-500', bg: 'bg-green-50' },
                            { icon: Clock, label: 'Pendentes', value: clients.filter(c => c.status === 'pending').length, color: 'text-yellow-600', bg: 'bg-yellow-50' },
                            { icon: Star, label: 'Avaliação', value: '4.9', color: 'text-orange-500', bg: 'bg-orange-50' },
                        ].map((stat, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                <Card>
                                    <CardContent className="p-4">
                                        <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-2`}>
                                            <stat.icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Clients */}
                    <Tabs defaultValue="clients">
                        <TabsList className="mb-6">
                            <TabsTrigger value="clients" className="gap-2"><Users className="w-4 h-4" /> Clientes</TabsTrigger>
                            <TabsTrigger value="profile" className="gap-2"><User className="w-4 h-4" /> Meu Perfil</TabsTrigger>
                        </TabsList>

                        <TabsContent value="clients">
                            <div className="space-y-3">
                                {clients.length === 0 ? (
                                    <Card>
                                        <CardContent className="py-12 text-center text-muted-foreground">
                                            Sem clientes atribuídos ainda.
                                        </CardContent>
                                    </Card>
                                ) : clients.map(client => (
                                    <Card key={client.id}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-3">
                                                <Avatar className="h-10 w-10 shrink-0">
                                                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                                        {client.nome?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold text-sm">{client.nome}</p>
                                                        <Badge variant="outline" className={`text-xs ${client.status === 'active' ? 'border-green-300 text-green-700' :
                                                                client.status === 'pending' ? 'border-yellow-300 text-yellow-700' :
                                                                    'border-red-300 text-red-700'
                                                            }`}>{client.status}</Badge>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mb-2">{client.telefone} • {client.email}</p>
                                                    {client.servicos_contratados?.length > 0 && (
                                                        <div className="flex flex-wrap gap-1 mb-2">
                                                            {client.servicos_contratados.map((s, i) => (
                                                                <Badge key={i} variant="secondary" className="text-xs">{s.nome}</Badge>
                                                            ))}
                                                        </div>
                                                    )}
                                                    <div className="mt-2">
                                                        <p className="text-xs text-muted-foreground mb-1">Notas de treino:</p>
                                                        <Textarea
                                                            defaultValue={client.notas || ''}
                                                            placeholder="Adicionar notas sobre o cliente..."
                                                            rows={2}
                                                            className="text-xs"
                                                            onBlur={e => saveNotes(client.id, e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground shrink-0 hidden sm:block">
                                                    {moment(client.created_date).format('DD/MM/YY')}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="profile">
                            <Card>
                                <CardHeader><CardTitle>Meu Perfil</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                        <div><p className="text-muted-foreground">Nome</p><p className="font-medium">{user?.full_name}</p></div>
                                        <div><p className="text-muted-foreground">Email</p><p className="font-medium">{user?.email}</p></div>
                                        <div><p className="text-muted-foreground">Especialidade</p><p className="font-medium">{user?.especialidade || '-'}</p></div>
                                        <div><p className="text-muted-foreground">Disponibilidade</p><p className="font-medium">{user?.disponibilidade || '-'}</p></div>
                                    </div>
                                    {user?.bio && (
                                        <div className="text-sm">
                                            <p className="text-muted-foreground mb-1">Biografia</p>
                                            <p className="bg-muted/50 p-3 rounded-lg">{user.bio}</p>
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
        <RequireRole roles={['personal_trainer', 'admin']}>
            <TrainerDashboardContent />
        </RequireRole>
    );
}