import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [token] = useState(searchParams.get('token'));
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast({ variant: "destructive", title: "Erro", description: "Token de reset não encontrado" });
            setTimeout(() => navigate('/login'), 2000);
        }
    }, [token, navigate, toast]);

    const handleReset = async (e) => {
        e.preventDefault();

        if (!password || !confirmPassword) {
            toast({ variant: "destructive", title: "Erro", description: "Todos os campos são obrigatórios" });
            return;
        }

        if (password.length < 6) {
            toast({ variant: "destructive", title: "Erro", description: "Senha deve ter pelo menos 6 caracteres" });
            return;
        }

        if (password !== confirmPassword) {
            toast({ variant: "destructive", title: "Erro", description: "As senhas não correspondem" });
            return;
        }

        setLoading(true);
        try {
            const result = await base44.auth.resetPassword(token, password);

            if (result.success) {
                setSuccess(true);
                toast({ title: "Sucesso!", description: "Senha redefinida com sucesso" });
                setTimeout(() => navigate('/login'), 2000);
            } else {
                toast({ variant: "destructive", title: "Erro", description: result.message || "Falha ao redefinir senha" });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Erro", description: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

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
                    <p className="text-muted-foreground text-sm mt-2">Redefinir Senha</p>
                </div>

                <Card className="bg-card/70 border-border backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="font-space text-xl">Nova Senha</CardTitle>
                        <CardDescription>Defina uma nova senha para sua conta</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="flex justify-center">
                                    <CheckCircle className="w-16 h-16 text-success" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Senha Redefinida!</h2>
                                <p className="text-muted-foreground">Sua senha foi alterada com sucesso. Você será redirecionado para o login em breve.</p>
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full h-11 font-bold tracking-wide"
                                >
                                    Ir para Login
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleReset} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Nova Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="Mínimo 6 caracteres"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Confirmar Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="password"
                                            placeholder="Confirme sua nova senha"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {password && confirmPassword && password !== confirmPassword && (
                                    <p className="text-sm text-destructive">As senhas não correspondem</p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-11 gap-2 font-bold tracking-wide active:scale-95 transition-transform"
                                    disabled={loading || !password || !confirmPassword}
                                >
                                    {loading ? 'A redefinir...' : 'REDEFINIR SENHA'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </form>
                        )}

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Lembrou a senha? <Link to="/login" className="text-primary font-medium hover:underline">Iniciar sessão</Link>
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
