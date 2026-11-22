import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Send, CheckCircle, Sparkles } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { getCurrentTenantId } from '@/lib/tenantStore';

export default function LeadForm() {
    const [form, setForm] = useState({ nome: '', telefone: '', email: '', interesse: '', mensagem: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        await base44.entities.Lead.create({
            ...form,
            tenant_id: getCurrentTenantId() || 'default',
            fonte: 'landing_page'
        });
        setLoading(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto text-center">
                    <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-space font-bold mb-2">Obrigado pelo interesse!</h3>
                    <p className="text-muted-foreground">A nossa equipa entrará em contacto consigo em breve.</p>
                </motion.div>
            </section>
        );
    }

    return (
        <section id="lead-form" className="py-24 px-4 sm:px-6 lg:px-8 bg-primary/5">
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-1.5 mb-6">
                            <Sparkles className="w-4 h-4 text-primary" />
                            <span className="text-primary text-sm font-medium">Comece hoje</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-space font-bold mb-4">
                            Quero ser membro
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6">
                            Preencha o formulário e a nossa equipa entrará em contacto para
                            encontrar o plano perfeito para si.
                        </p>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Aula experimental gratuita</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Sem compromisso inicial</div>
                            <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-primary" /> Acompanhamento personalizado</div>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                        <Card className="shadow-2xl shadow-primary/5">
                            <CardContent className="p-6 sm:p-8">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <Input
                                        placeholder="Nome completo *"
                                        value={form.nome}
                                        onChange={e => setForm({ ...form, nome: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Telefone *"
                                        value={form.telefone}
                                        onChange={e => setForm({ ...form, telefone: e.target.value })}
                                        required
                                    />
                                    <Input
                                        placeholder="Email"
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                    />
                                    <Select value={form.interesse} onValueChange={v => setForm({ ...form, interesse: v })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Serviço de interesse" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="musculacao">Musculação</SelectItem>
                                            <SelectItem value="crossfit">CrossFit</SelectItem>
                                            <SelectItem value="yoga">Yoga & Pilates</SelectItem>
                                            <SelectItem value="personal">Personal Trainer</SelectItem>
                                            <SelectItem value="grupo">Aulas de Grupo</SelectItem>
                                            <SelectItem value="completo">Plano Completo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Textarea
                                        placeholder="Mensagem (opcional)"
                                        value={form.mensagem}
                                        onChange={e => setForm({ ...form, mensagem: e.target.value })}
                                        rows={3}
                                    />
                                    <Button type="submit" className="w-full h-12 text-base gap-2" disabled={loading}>
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Enviar
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}