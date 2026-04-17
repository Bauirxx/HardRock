import { useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Lock, Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await base44.auth.login(email, password);
            if (data.token) {
                toast({ title: "Bem-vindo!", description: `Sessão iniciada como ${data.user.role}` });
                const params = new URLSearchParams(window.location.search);
                let defaultUrl = '/cliente';
                if (data.user.role === 'admin' || data.user.role === 'staff') {
                    defaultUrl = '/admin';
                } else if (data.user.role === 'external_client') {
                    defaultUrl = '/loja';
                }
                
                const returnUrl = params.get('return_url') || defaultUrl;
                window.location.href = returnUrl;
            } else {
                toast({ variant: "destructive", title: "Erro no login", description: "Credenciais inválidas" });
            }
        } catch (error) {
            toast({ variant: "destructive", title: "Erro de conexão", description: error.message });
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
                    <motion.div
                        className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center shadow-2xl shadow-primary/30 mb-4"
                        animate={{
                            rotate: [0, 360],
                            scale: [1, 1.05, 1]
                        }}
                        transition={{
                            rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                    >
                        <Dumbbell className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.h1
                        className="text-3xl font-space font-bold text-foreground tracking-tighter uppercase italic"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <motion.span
                            className="text-primary"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            Hard Rock
                        </motion.span>{' '}
                        <motion.span
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            Gym
                        </motion.span>
                    </motion.h1>
                    <motion.p
                        className="text-muted-foreground text-sm mt-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                    >
                        Acesso Restrito à Plataforma
                    </motion.p>
                </div>

                <Card className="bg-card/70 border-border backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="font-space text-xl">Iniciar Sessão</CardTitle>
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
                                        onChange={e => setEmail(e.target.value)}
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
                                        onChange={e => setPassword(e.target.value)}
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
                                Ainda não tem conta? <Link to="/registo" className="text-primary font-medium hover:underline">Criar conta</Link>
                            </p>
                            <p className="text-center text-sm text-muted-foreground">
                                Esqueceu a senha? <Link to="/forgot-password" className="text-primary font-medium hover:underline">Recuperar senha</Link>
                            </p>
                        </div>

                        {/* Biceps Animation */}
                        <div className="mt-8 pt-6 border-t border-border flex justify-center">
                            <motion.div
                                animate={{
                                    scaleY: [1, 1.2, 1]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="text-5xl"
                            >
                                💪
                            </motion.div>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-muted-foreground text-xs mt-8">
                    © 2026 Hard Rock Gym. Todos os direitos reservados.
                </p>
            </motion.div>
        </div>
    );
}
