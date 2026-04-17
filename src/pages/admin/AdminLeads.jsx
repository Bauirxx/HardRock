import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UserPlus, Phone, Mail, Eye, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import moment from 'moment';

const STATUS_MAP = {
    new: { label: 'Novo', color: 'bg-green-100 text-green-800' },
    contacted: { label: 'Contactado', color: 'bg-blue-100 text-blue-800' },
    converted: { label: 'Convertido', color: 'bg-purple-100 text-purple-800' },
    lost: { label: 'Perdido', color: 'bg-red-100 text-red-800' },
};

export default function AdminLeads() {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState(null);
    const { toast } = useToast();

    useEffect(() => { loadLeads(); }, []);

    const loadLeads = async () => {
        const data = await base44.entities.Lead.list('-created_date', 100);
        setLeads(data);
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        await base44.entities.Lead.update(id, { status });
        toast({ title: "Estado atualizado" });
        loadLeads();
    };

    const updateNotes = async (id, notas) => {
        await base44.entities.Lead.update(id, { notas });
        toast({ title: "Notas atualizadas" });
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-space font-bold">Leads</h1>
                <p className="text-muted-foreground text-sm">{leads.filter(l => l.status === 'new').length} novos leads</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {Object.entries(STATUS_MAP).map(([key, val]) => (
                    <Card key={key}>
                        <CardContent className="p-3 text-center">
                            <p className="text-2xl font-bold">{leads.filter(l => l.status === key).length}</p>
                            <Badge className={`${val.color} mt-1`}>{val.label}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead><tr className="border-b bg-muted/30">
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Nome</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Contacto</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Interesse</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                                <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                                <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                            </tr></thead>
                            <tbody>
                                {leads.map(lead => (
                                    <tr key={lead.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <UserPlus className="w-4 h-4 text-orange-600" />
                                                </div>
                                                <span className="font-medium text-sm">{lead.nome}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm hidden sm:table-cell">
                                            <div className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.telefone}</div>
                                            {lead.email && <div className="flex items-center gap-1 text-xs text-muted-foreground"><Mail className="w-3 h-3" />{lead.email}</div>}
                                        </td>
                                        <td className="p-4 text-sm hidden md:table-cell">{lead.interesse || '-'}</td>
                                        <td className="p-4">
                                            <Select defaultValue={lead.status} onValueChange={v => updateStatus(lead.id, v)}>
                                                <SelectTrigger className="h-8 w-32">
                                                    <Badge className={`${STATUS_MAP[lead.status]?.color} text-xs`}>{STATUS_MAP[lead.status]?.label}</Badge>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(STATUS_MAP).map(([key, val]) => (
                                                        <SelectItem key={key} value={key}>{val.label}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{moment(lead.created_date).fromNow()}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(lead)}>
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                                <a href={`https://wa.me/${lead.telefone?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600">
                                                        <MessageCircle className="w-4 h-4" />
                                                    </Button>
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {leads.length === 0 && <div className="text-center py-12 text-muted-foreground">{loading ? 'A carregar...' : 'Nenhum lead.'}</div>}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Lead: {selected?.nome}</DialogTitle></DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-muted-foreground">Telefone:</span><p className="font-medium">{selected.telefone}</p></div>
                                <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selected.email || '-'}</p></div>
                                <div><span className="text-muted-foreground">Interesse:</span><p className="font-medium">{selected.interesse || '-'}</p></div>
                                <div><span className="text-muted-foreground">Fonte:</span><p className="font-medium">{selected.fonte || '-'}</p></div>
                            </div>
                            {selected.mensagem && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Mensagem:</span>
                                    <p className="mt-1 p-3 bg-muted rounded-lg">{selected.mensagem}</p>
                                </div>
                            )}
                            <div>
                                <span className="text-sm text-muted-foreground">Notas internas:</span>
                                <Textarea
                                    defaultValue={selected.notas || ''}
                                    placeholder="Adicionar notas..."
                                    onBlur={e => updateNotes(selected.id, e.target.value)}
                                    rows={3}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}