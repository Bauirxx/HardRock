import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Lock, Mail, ArrowRight, User, Calendar, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

// Regras da password — têm de bater certo com o backend (RegisterRequestDTO)
const PASSWORD_RULES = [
    { id: 'len', label: 'Mínimo 8 caracteres', test: (p) => p.length >= 8 },
    { id: 'upper', label: 'Uma letra maiúscula (A-Z)', test: (p) => /[A-Z]/.test(p) },
    { id: 'lower', label: 'Uma letra minúscula (a-z)', test: (p) => /[a-z]/.test(p) },
    { id: 'digit', label: 'Um número (0-9)', test: (p) => /\d/.test(p) },
    { id: 'special', label: 'Um símbolo (@ $ ! % * ? & #)', test: (p) => /[@$!%*?&#]/.test(p) },
];

function passwordValida(p) {
    return PASSWORD_RULES.every(r => r.test(p));
}

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        genero: '',
        idade: ''
    });
    const [loading, setLoading] = useState(false);
    const [passwordFocus, setPasswordFocus] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (loading) return; // evita duplo-submit
        if (!formData.full_name || !formData.email || !formData.password || !formData.genero || !formData.idade) {
            toast({ variant: "destructive", title: "Erro", description: "Todos os campos são obrigatórios" });
            return;
        }
        if (!passwordValida(formData.password)) {
            toast({ variant: "destructive", title: "Password fraca", description: "A password não cumpre todos os requisitos indicados." });
            return;
        }
        if (formData.idade < 14 || formData.idade > 120) {
            toast({ variant: "destructive", title: "Erro", description: "Idade deve estar entre 14 e 120 anos" });
            return;
        }

        setLoading(true);
        try {
            const result = await base44.auth.register({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
                genero: formData.genero,
                idade: parseInt(formData.idade)
            });

            // O backend cria a conta e devolve logo os tokens (já fica autenticado)
            if (result && (result.token || result.user)) {
                toast({ title: "Bem-vindo!", description: "Conta criada com sucesso." });
                setTimeout(() => navigate('/'), 800);
            } else {
                toast({ variant: "destructive", title: "Erro", description: "Falha ao registar. Tenta novamente." });
            }
        } catch (error) {
            // Email já existe → a conta provavelmente já foi criada antes; encaminha para login
            const msg = error.message || 'Erro no registo';
            if (/já está registado|já existe|conflito|409/i.test(msg)) {
                toast({ title: "Conta já existe", description: "Este email já tem conta. Vai iniciar sessão." });
                setTimeout(() => navigate('/login'), 1200);
            } else {
                toast({ variant: "destructive", title: "Erro", description: msg });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient brand glow */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/30 rounded-full blur-[140px]"></div>
                <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-accent/20 rounded-full blur-[140px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center shadow-2xl shadow-primary/30 mb-4 rotate-3">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-space font-bold text-foreground tracking-tighter uppercase italic">
                        <span className="text-primary">Hard Rock</span> Gym
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2">
                        Crie sua conta
                    </p>
                </div>

                <Card className="bg-card/70 border-border backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="font-space text-xl">
                            Criar Conta
                        </CardTitle>
                        <CardDescription>
                            Junte-se à comunidade Hard Rock Gym
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="text"
                                            placeholder="Ex: João Silva"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={formData.full_name}
                                            onChange={e => setFormData({...formData, full_name: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="seu.email@example.com"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="Cria uma password forte"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            onFocus={() => setPasswordFocus(true)}
                                            required
                                        />
                                    </div>
                                    {(passwordFocus || formData.password.length > 0) && (
                                        <ul className="mt-2 space-y-1 rounded-lg border border-border bg-background/50 p-3">
                                            {PASSWORD_RULES.map(rule => {
                                                const ok = rule.test(formData.password);
                                                return (
                                                    <li key={rule.id} className={`flex items-center gap-2 text-xs ${ok ? 'text-green-500' : 'text-muted-foreground'}`}>
                                                        {ok ? <Check className="w-3.5 h-3.5 shrink-0" /> : <X className="w-3.5 h-3.5 shrink-0 opacity-50" />}
                                                        {rule.label}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Género</Label>
                                        <select
                                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                                            value={formData.genero}
                                            onChange={e => setFormData({...formData, genero: e.target.value})}
                                            required
                                        >
                                            <option value="">Selecione</option>
                                            <option value="M">Masculino</option>
                                            <option value="F">Feminino</option>
                                            <option value="O">Outro</option>
                                            <option value="N">Prefiro não dizer</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Idade</Label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="number"
                                                placeholder="18"
                                                className="pl-10 focus-visible:ring-primary"
                                                min="14"
                                                max="120"
                                                value={formData.idade}
                                                onChange={e => setFormData({...formData, idade: e.target.value})}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 gap-2 font-bold tracking-wide active:scale-95 transition-transform"
                                    disabled={loading}
                                >
                                    {loading ? 'A registar...' : 'CRIAR CONTA'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Iniciar sessão</Link>
                        </p>
                        <p className="text-center text-xs text-muted-foreground mt-2">
                            Queres frequentar o ginásio? <Link to="/ginasio/inscricao" className="text-primary hover:underline">Pedir inscrição</Link>
                        </p>
                    </CardContent>
                </Card>

                <p className="text-center text-muted-foreground text-xs mt-8">
                    © 2026 Hard Rock Gym. Todos os direitos reservados.
                </p>
            </motion.div>
        </div>
    );
}
