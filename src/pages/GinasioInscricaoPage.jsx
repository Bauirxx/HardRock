import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dumbbell, User, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function GinasioInscricaoPage() {
    const [form, setForm] = useState({ nome: '', telefone: '', email: '', planoPretendido: '', mensagem: '' });
    const [planos, setPlanos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [enviado, setEnviado] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        // Tenta sugerir planos existentes (opcional — falha em silêncio)
        base44.entities.Service.list('nome', 50)
            .then(data => Array.isArray(data) && setPlanos(data))
            .catch(() => {});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;
        if (!form.nome || !form.telefone) {
            toast({ variant: 'destructive', title: 'Campos obrigatórios', description: 'Nome e telefone são obrigatórios.' });
            return;
        }
        setLoading(true);
        try {
            await base44.entities.GymApplication.create(form);
            setEnviado(true);
        } catch (err) {
            toast({ variant: 'destructive', title: 'Erro', description: err.message });
        } finally {
            setLoading(false);
        }
    };

    if (enviado) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-space font-bold mb-2">Pedido enviado!</h1>
                    <p className="text-muted-foreground mb-6">
                        Recebemos o teu pedido. A nossa equipa vai entrar em contacto para marcar a tua visita e concluir a inscrição presencialmente.
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => navigate('/ginasio')}>Voltar ao ginásio</Button>
                        <Button onClick={() => navigate('/')}>Ir para a loja</Button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/30 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-accent/20 rounded-full blur-[140px]"></div>
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center shadow-2xl shadow-primary/30 mb-4 rotate-3">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-space font-bold text-foreground tracking-tighter uppercase italic">
                        <span className="text-primary">Hard Rock</span> Gym
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2">Agendar visita / Pedido de inscrição</p>
                </div>

                <Card className="bg-card/70 border-border backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="font-space text-xl">Quero frequentar o ginásio</CardTitle>
                        <CardDescription>
                            Deixa os teus dados e a nossa equipa entra em contacto para marcar a tua visita.
                            A inscrição é finalizada <strong>presencialmente no ginásio</strong>; depois recebes por email as tuas credenciais de acesso.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nome Completo</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input className="pl-10" placeholder="Ex: João Silva" value={form.nome}
                                        onChange={e => setForm({ ...form, nome: e.target.value })} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Telefone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input className="pl-10" placeholder="84 000 0000" value={form.telefone}
                                        onChange={e => setForm({ ...form, telefone: e.target.value })} required />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Email (opcional)</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input type="email" className="pl-10" placeholder="seu.email@example.com" value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Plano pretendido</Label>
                                {planos.length > 0 ? (
                                    <select className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                                        value={form.planoPretendido}
                                        onChange={e => setForm({ ...form, planoPretendido: e.target.value })}>
                                        <option value="">Selecione (opcional)</option>
                                        {planos.map(p => <option key={p.id} value={p.nome}>{p.nome}</option>)}
                                    </select>
                                ) : (
                                    <Input placeholder="Ex: Plano Mensal" value={form.planoPretendido}
                                        onChange={e => setForm({ ...form, planoPretendido: e.target.value })} />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Mensagem (opcional)</Label>
                                <Textarea rows={3} placeholder="Objetivos, horários preferidos, dúvidas..." value={form.mensagem}
                                    onChange={e => setForm({ ...form, mensagem: e.target.value })} />
                            </div>

                            <Button type="submit" className="w-full h-11 gap-2 font-bold tracking-wide" disabled={loading}>
                                {loading ? 'A enviar...' : 'ENVIAR PEDIDO'}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Já és membro? <Link to="/login" className="text-primary font-medium hover:underline">Iniciar sessão</Link>
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
