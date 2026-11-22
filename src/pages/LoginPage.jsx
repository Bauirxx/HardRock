import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import DeadliftAnimation from '@/components/DeadliftAnimation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [animState, setAnimState] = useState('idle');
    const { toast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAnimState('lifting');
        try {
            const data = await base44.auth.login(email, password);
            if (data.token) {
                setAnimState('success');
                toast({ title: "Bem-vindo!", description: `Sessão iniciada como ${data.user.role}` });
                const params = new URLSearchParams(window.location.search);
                let defaultUrl = '/cliente';
                if (data.user.role === 'admin' || data.user.role === 'staff') {
                    defaultUrl = '/admin';
                } else if (data.user.role === 'external_client') {
                    defaultUrl = '/loja';
                }
                const returnUrl = params.get('return_url') || defaultUrl;
                setTimeout(() => { window.location.href = returnUrl; }, 900);
            } else {
                setAnimState('fail');
                toast({ variant: "destructive", title: "Erro no login", description: "Credenciais inválidas" });
                setTimeout(() => setAnimState('idle'), 2200);
            }
        } catch (error) {
            setAnimState('fail');
            toast({ variant: "destructive", title: "Erro de conexão", description: error.message });
            setTimeout(() => setAnimState('idle'), 2200);
        } finally {
            setLoading(false);
        }
    };

    const resetAnim = () => { if (animState === 'fail') setAnimState('idle'); };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Ambient brand glow */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-[-15%] left-[-10%] w-[45%] h-[45%] bg-primary/30 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-15%] right-[-10%] w-[45%] h-[45%] bg-accent/20 rounded-full blur-[140px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl z-10 flex flex-col lg:flex-row items-center gap-10"
            >
                {/* Left panel — animation (desktop only) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="hidden lg:flex flex-col items-center justify-center flex-1"
                >
                    <DeadliftAnimation state={animState} />
                    <h1 className="text-5xl font-space font-black text-foreground tracking-tighter uppercase italic mt-6 text-center">
                        <span className="text-primary">Hard Rock</span> Gym
                    </h1>
                    <p className="text-muted-foreground text-sm mt-2">Força. Disciplina. Resultados.</p>
                </motion.div>

                {/* Right panel — form */}
                <div className="w-full max-w-md flex-shrink-0">
                    {/* Mobile header */}
                    <div className="lg:hidden flex flex-col items-center mb-6">
                        <DeadliftAnimation state={animState} />
                        <h1 className="text-3xl font-space font-black text-foreground tracking-tighter uppercase italic mt-2">
                            <span className="text-primary">Hard Rock</span> Gym
                        </h1>
                    </div>

                    <Card className="bg-card/70 border-border backdrop-blur-xl shadow-2xl">
                        <CardHeader>
                            <CardTitle className="font-space text-xl">Iniciar Sessão</CardTitle>
                            <p className="text-muted-foreground text-sm">Acesso Restrito à Plataforma</p>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="ex: admin@hardrock.com"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={email}
                                            onChange={e => { setEmail(e.target.value); resetAnim(); }}
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
                                            placeholder="••••••••"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={password}
                                            onChange={e => { setPassword(e.target.value); resetAnim(); }}
                                            required
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full h-11 gap-2 font-bold tracking-wide active:scale-95 transition-transform"
                                    disabled={loading}
                                >
                                    {loading ? 'A verificar...' : 'ACEDER AO GINÁSIO'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </form>

                            <div className="space-y-3 mt-6">
                                <p className="text-center text-sm text-muted-foreground">
                                    Ainda não tem conta?{' '}
                                    <Link to="/registo" className="text-primary font-medium hover:underline">Criar conta</Link>
                                </p>
                                <p className="text-center text-sm text-muted-foreground">
                                    Esqueceu a senha?{' '}
                                    <Link to="/forgot-password" className="text-primary font-medium hover:underline">Recuperar senha</Link>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <p className="text-center text-muted-foreground text-xs mt-6">
                        © 2026 Hard Rock Gym. Todos os direitos reservados.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
