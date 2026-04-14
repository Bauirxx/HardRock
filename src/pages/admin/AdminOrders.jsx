import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Eye, Package, Truck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import moment from 'moment';

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-primary/10 text-primary',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selected, setSelected] = useState(null);
    const { toast } = useToast();

    useEffect(() => { loadOrders(); }, []);

    const loadOrders = async () => {
        const data = await base44.entities.Order.list('-created_date', 100);
        setOrders(data);
        setLoading(false);
    };

    const updateStatus = async (orderId, status) => {
        await base44.entities.Order.update(orderId, { status });
        toast({ title: `Estado atualizado para: ${status}` });
        loadOrders();
        if (selected?.id === orderId) setSelected(prev => ({ ...prev, status }));
    };

    const filtered = orders.filter(o =>
        o.tracking_code?.toLowerCase().includes(search.toLowerCase()) ||
        o.guest_name?.toLowerCase().includes(search.toLowerCase()) ||
        o.guest_phone?.includes(search)
    );

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-space font-bold">Encomendas</h1>
                    <p className="text-muted-foreground text-sm">{orders.length} encomendas</p>
                </div>
            </div>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Procurar por código, nome ou telefone..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <Card>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b bg-muted/30">
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Código</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden sm:table-cell">Cliente</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden md:table-cell">Total</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Estado</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(order => (
                                    <tr key={order.id} className="border-b hover:bg-muted/30 transition-colors">
                                        <td className="p-4 font-mono text-sm font-medium">{order.tracking_code || '-'}</td>
                                        <td className="p-4 text-sm hidden sm:table-cell">{order.guest_name || 'Cliente logado'}</td>
                                        <td className="p-4 text-sm font-semibold hidden md:table-cell">{order.total?.toLocaleString()} MZN</td>
                                        <td className="p-4">
                                            <Select defaultValue={order.status} onValueChange={v => updateStatus(order.id, v)}>
                                                <SelectTrigger className="h-8 w-32">
                                                    <Badge className={`${STATUS_COLORS[order.status]} text-xs`}>{order.status}</Badge>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.keys(STATUS_COLORS).map(s => (
                                                        <SelectItem key={s} value={s}>{s}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </td>
                                        <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{moment(order.created_date).format('DD/MM/YYYY HH:mm')}</td>
                                        <td className="p-4 text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelected(order)}>
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground">{loading ? 'A carregar...' : 'Nenhuma encomenda.'}</div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="max-w-lg">
                    <DialogHeader><DialogTitle>Encomenda {selected?.tracking_code}</DialogTitle></DialogHeader>
                    {selected && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><span className="text-muted-foreground">Cliente:</span><p className="font-medium">{selected.guest_name || 'Logado'}</p></div>
                                <div><span className="text-muted-foreground">Telefone:</span><p className="font-medium">{selected.guest_phone || '-'}</p></div>
                                <div><span className="text-muted-foreground">Email:</span><p className="font-medium">{selected.guest_email || '-'}</p></div>
                                <div><span className="text-muted-foreground">Pagamento:</span><p className="font-medium">{selected.metodo_pagamento || '-'}</p></div>
                            </div>
                            {selected.endereco_entrega && (
                                <div className="text-sm">
                                    <span className="text-muted-foreground">Morada:</span>
                                    <p className="font-medium">{selected.endereco_entrega.rua}, {selected.endereco_entrega.cidade}</p>
                                </div>
                            )}
                            <div className="space-y-2">
                                <p className="font-semibold text-sm">Itens:</p>
                                {selected.items?.map((item, i) => (
                                    <div key={i} className="flex justify-between p-2 bg-muted/50 rounded text-sm">
                                        <span>{item.nome} × {item.quantidade}</span>
                                        <span className="font-semibold">{(item.preco * item.quantidade).toLocaleString()} MZN</span>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                <span>Total</span>
                                <span>{selected.total?.toLocaleString()} MZN</span>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}