import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Mail, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast({ variant: "destructive", title: "Erro", description: "Email é obrigatório" });
            return;
        }

        setLoading(true);
        try {
            const result = await base44.auth.forgotPassword(email);

            setSubmitted(true);
            toast({ title: "Sucesso!", description: "Se o email existir, um link de reset foi enviado" });
            setTimeout(() => navigate('/login'), 3000);
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
                    <p className="text-muted-foreground text-sm mt-2">Recuperar Senha</p>
                </div>

                <Card className="bg-card/70 border-border backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="font-space text-xl">Esqueceu sua Senha?</CardTitle>
                        <CardDescription>Digite seu email para receber um link de recuperação</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {submitted ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-4"
                            >
                                <div className="flex justify-center">
                                    <CheckCircle className="w-16 h-16 text-success" />
                                </div>
                                <h2 className="text-xl font-bold text-foreground">Email Enviado!</h2>
                                <p className="text-muted-foreground">
                                    Se o email <span className="font-medium">{email}</span> estiver registado, você receberá um link para redefinir sua senha em breve.
                                </p>
                                <p className="text-sm text-muted-foreground">Verifique também a pasta de spam.</p>
                                <Button
                                    onClick={() => navigate('/login')}
                                    className="w-full h-11 font-bold tracking-wide"
                                >
                                    Voltar ao Login
                                </Button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input
                                            type="email"
                                            placeholder="seu.email@example.com"
                                            className="pl-10 focus-visible:ring-primary"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 gap-2 font-bold tracking-wide active:scale-95 transition-transform"
                                    disabled={loading}
                                >
                                    {loading ? 'A enviar...' : 'ENVIAR LINK DE RESET'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </form>
                        )}

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Lembrou a senha? <Link to="/login" className="text-primary font-medium hover:underline">Voltar ao login</Link>
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
