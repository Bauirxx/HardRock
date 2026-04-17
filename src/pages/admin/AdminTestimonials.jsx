import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Star, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getCurrentTenantId } from '@/lib/tenantStore';

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [form, setForm] = useState({ nome: '', texto: '', stars: 5, status: 'approved' });
    const { toast } = useToast();

    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        const data = await base44.entities.Testimonial.list('-created_date', 50);
        setTestimonials(data);
        setLoading(false);
    };

    const handleSave = async () => {
        await base44.entities.Testimonial.create({ ...form, stars: parseInt(form.stars), tenant_id: getCurrentTenantId() || 'default' });
        toast({ title: "Depoimento adicionado" });
        setDialogOpen(false);
        setForm({ nome: '', texto: '', stars: 5, status: 'approved' });
        loadData();
    };

    const updateStatus = async (id, status) => {
        await base44.entities.Testimonial.update(id, { status });
        toast({ title: "Estado atualizado" });
        loadData();
    };

    const handleDelete = async (id) => {
        await base44.entities.Testimonial.delete(id);
        toast({ title: "Depoimento removido" });
        loadData();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Depoimentos</h1>
                    <p className="text-muted-foreground text-sm">{testimonials.length} depoimentos</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="gap-2"><Plus className="w-4 h-4" /> Novo</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader><DialogTitle>Novo Depoimento</DialogTitle></DialogHeader>
                        <div className="space-y-4">
                            <div><Label>Nome</Label><Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} /></div>
                            <div><Label>Texto</Label><Textarea value={form.texto} onChange={e => setForm({ ...form, texto: e.target.value })} rows={3} /></div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label>Estrelas</Label>
                                    <Select value={form.stars.toString()} onValueChange={v => setForm({ ...form, stars: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            {[1, 2, 3, 4, 5].map(n => <SelectItem key={n} value={n.toString()}>{n} estrela{n > 1 ? 's' : ''}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Estado</Label>
                                    <Select value={form.status} onValueChange={v => setForm({ ...form, status: v })}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="approved">Aprovado</SelectItem>
                                            <SelectItem value="pending">Pendente</SelectItem>
                                            <SelectItem value="rejected">Rejeitado</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button onClick={handleSave} className="w-full">Adicionar</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="space-y-3">
                {testimonials.map(t => (
                    <Card key={t.id}>
                        <CardContent className="p-4 flex items-start gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-sm">{t.nome}</span>
                                    <div className="flex">{Array.from({ length: t.stars || 5 }).map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}</div>
                                    <Badge className={
                                        t.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            t.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                    }>{t.status}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">"{t.texto}"</p>
                            </div>
                            <div className="flex gap-1 shrink-0">
                                <Select defaultValue={t.status} onValueChange={v => updateStatus(t.id, v)}>
                                    <SelectTrigger className="h-8 w-28"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="approved">Aprovado</SelectItem>
                                        <SelectItem value="pending">Pendente</SelectItem>
                                        <SelectItem value="rejected">Rejeitado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(t.id)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {testimonials.length === 0 && !loading && (
                    <div className="text-center py-12 text-muted-foreground">Nenhum depoimento.</div>
                )}
            </div>
        </div>
    );
}