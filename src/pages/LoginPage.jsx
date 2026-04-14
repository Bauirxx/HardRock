import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dumbbell, Lock, Mail, ArrowRight, ShieldCheck, User as UserIcon, ShoppingCart } from 'lucide-react';
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
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900 rounded-full blur-[120px]"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/20 mb-4 rotate-3">
                        <Dumbbell className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-space font-bold text-white tracking-tighter uppercase italic">
                        <span className="text-primary">Hard Rock</span> Gym
                    </h1>
                    <p className="text-slate-500 text-sm mt-2">Acesso Restrito à Plataforma</p>
                </div>

                <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-xl shadow-2xl">
                    <CardHeader>
                        <CardTitle className="text-white font-space text-xl">Iniciar Sessão</CardTitle>
                        <CardDescription className="text-slate-400">Entre com as suas credenciais de membro.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input 
                                        type="email"
                                        placeholder="ex: admin@hardrock.com" 
                                        className="bg-slate-800 border-slate-700 text-white pl-10 focus:ring-primary"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300">Senha</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <Input 
                                        type="password"
                                        placeholder="••••••••" 
                                        className="bg-slate-800 border-slate-700 text-white pl-10 focus:ring-primary"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-primary hover:bg-red-700 text-white font-bold h-11 gap-2 transition-all duration-300 active:scale-95"
                                disabled={loading}
                            >
                                {loading ? 'A verificar...' : 'ACEDER AO GINÁSIO'}
                                <ArrowRight className="w-4 h-4" />
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-800 space-y-4">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold text-center mb-4">Dicas de Simulação</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer" onClick={() => setEmail('admin@hardrock.com')}>
                                    <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    <span className="text-xs text-slate-300"><b>admin</b>@hardrock.com<br/><span className="text-[10px] text-slate-500">Acesso Total (Gestão)</span></span>
                                </div>
                                <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer" onClick={() => setEmail('staff@hardrock.com')}>
                                    <ShieldCheck className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                                    <span className="text-xs text-slate-300"><b>staff</b>@hardrock.com<br/><span className="text-[10px] text-slate-500">Gestão Limitada (Staff)</span></span>
                                </div>
                                <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer" onClick={() => setEmail('internal@hardrock.com')}>
                                    <UserIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                    <span className="text-xs text-slate-300"><b>internal</b>@hardrock.com<br/><span className="text-[10px] text-slate-500">Cliente Interno (Membro)</span></span>
                                </div>
                                <div className="flex items-start gap-3 p-2 rounded-lg bg-slate-800/30 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer" onClick={() => setEmail('external@hardrock.com')}>
                                    <ShoppingCart className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-xs text-slate-300"><b>external</b>@hardrock.com<br/><span className="text-[10px] text-slate-500">Cliente Externo (Loja Apenas)</span></span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <p className="text-center text-slate-600 text-xs mt-8">
                    © 2026 Hard Rock Gym. Todos os direitos reservados.
                </p>
            </motion.div>
        </div>
    );
}
