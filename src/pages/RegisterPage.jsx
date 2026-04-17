import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Lock, Mail, ArrowRight, User, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
    const [step, setStep] = useState('register');
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        password: '',
        genero: '',
        idade: ''
    });
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!formData.full_name || !formData.email || !formData.password || !formData.genero || !formData.idade) {
            toast({ variant: "destructive", title: "Erro", description: "Todos os campos são obrigatórios" });
            return;
        }
        if (formData.password.length < 6) {
            toast({ variant: "destructive", title: "Erro", description: "Senha deve ter pelo menos 6 caracteres" });
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

            if (result.pending) {
                setStep('verify');
                toast({ title: "Sucesso", description: "Código de verificação enviado para seu email" });
                if (result.dev_code) {
                    console.log('DEV: Verification code =', result.dev_code);
                }
            } else {
                toast({ variant: "destructive", title: "Erro", description: "Falha ao registar" });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Erro", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        if (!verificationCode) {
            toast({ variant: "destructive", title: "Erro", description: "Código de verificação obrigatório" });
            return;
        }

        setLoading(true);
        try {
            const result = await base44.auth.verifyEmail({
                email: formData.email,
                code: verificationCode
            });

            if (result.verified) {
                toast({ title: "Bem-vindo!", description: "Conta ativada com sucesso" });
                setTimeout(() => navigate('/login'), 1500);
            } else {
                toast({ variant: "destructive", title: "Erro", description: "Falha na verificação" });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Erro", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setLoading(true);
        try {
            await base44.auth.resendVerification({ email: formData.email });
            toast({ title: "Enviado", description: "Novo código enviado para seu email" });
        } catch (error) {
            toast({ variant: "destructive", title: "Erro", description: error.message });
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
                        {step === 'register' ? 'Crie sua conta' : 'Verifique seu email'}
                    </p>
                </div>

                <Card className="bg-card/70 border-border backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="font-space text-xl">
                            {step === 'register' ? 'Criar Conta' : 'Verificar Email'}
                        </CardTitle>
                        <CardDescription>
                            {step === 'register'
                                ? 'Junte-se à comunidade Hard Rock Gym'
                                : 'Digite o código enviado para seu email'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {step === 'register' ? (
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
                                            placeholder="Mínimo 6 caracteres"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={formData.password}
                                            onChange={e => setFormData({...formData, password: e.target.value})}
                                            required
                                        />
                                    </div>
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
                        ) : (
                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="p-3 bg-secondary/50 rounded-lg border border-border">
                                    <p className="text-sm text-muted-foreground">
                                        Enviámos um código de verificação para<br/>
                                        <span className="font-medium text-foreground">{formData.email}</span>
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label>Código de Verificação</Label>
                                    <Input
                                        type="text"
                                        placeholder="000000"
                                        maxLength="6"
                                        className="text-center text-2xl font-mono tracking-widest focus-visible:ring-primary"
                                        value={verificationCode}
                                        onChange={e => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 gap-2 font-bold tracking-wide active:scale-95 transition-transform"
                                    disabled={loading || verificationCode.length !== 6}
                                >
                                    {loading ? 'A verificar...' : 'VERIFICAR EMAIL'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>

                                <button
                                    type="button"
                                    onClick={handleResendCode}
                                    disabled={loading}
                                    className="w-full text-sm text-primary hover:underline disabled:opacity-50"
                                >
                                    Reenviar código
                                </button>
                            </form>
                        )}

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Já tem conta? <Link to="/login" className="text-primary font-medium hover:underline">Iniciar sessão</Link>
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
