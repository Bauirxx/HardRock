import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, ShoppingCart, Users, TrendingUp, CreditCard, Package, Download } from 'lucide-react';

const fmtMT = (n) => new Intl.NumberFormat('pt-PT', { maximumFractionDigits: 2 }).format(n || 0) + ' MT';

// Gera e descarrega um CSV (abre no Excel). Escapa aspas e vírgulas.
function exportarCSV(nomeFicheiro, colunas, linhas) {
    const escapar = (v) => {
        const s = v == null ? '' : String(v);
        return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = colunas.map(c => escapar(c.label)).join(';');
    const corpo = linhas.map(l => colunas.map(c => escapar(c.get(l))).join(';')).join('\n');
    const csv = '﻿' + header + '\n' + corpo; // BOM para acentos no Excel
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nomeFicheiro}-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function Kpi({ icon: Icon, label, value, sub, color = 'text-primary' }) {
    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${color}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="text-xl font-bold truncate">{value}</p>
                        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminReports() {
    const [loading, setLoading] = useState(true);
    const [subs, setSubs] = useState([]);
    const [orders, setOrders] = useState([]);
    const [clients, setClients] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [s, o, c] = await Promise.all([
                    base44.subscriptions.list({ size: 500 }).catch(() => []),
                    base44.entities.Order.list('-created_date', 500).catch(() => []),
                    base44.entities.Client.list('-created_date', 500).catch(() => []),
                ]);
                setSubs(Array.isArray(s) ? s : []);
                setOrders(Array.isArray(o) ? o : []);
                setClients(Array.isArray(c) ? c : []);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const nomeCliente = (id) => {
        const c = clients.find(x => x.id === id);
        return c ? (c.nome || c.full_name || c.name || '—') : '—';
    };

    // ── Ginásio (subscrições) ──
    const subsPagas = subs.filter(s => s.status !== 'cancelled' && s.status !== 'cancelado');
    const subsActivas = subs.filter(s => s.status === 'active' || s.status === 'activo');
    const receitaGinasio = subsPagas.reduce((acc, s) => acc + (parseFloat(s.valor_pago) || 0), 0);
    const clientesPagaram = new Set(subsPagas.map(s => s.client_id).filter(Boolean)).size;

    // ── Loja (vendas) ──
    const vendasPagas = orders.filter(o => o.status && !['pendente', 'cancelado', 'cancelled'].includes(o.status));
    const receitaLoja = vendasPagas.reduce((acc, o) => acc + (parseFloat(o.valor_total) || 0), 0);
    const itensVendidos = vendasPagas.reduce((acc, o) => acc + (Array.isArray(o.items) ? o.items.reduce((a, i) => a + (i.quantidade || i.qtd || 1), 0) : 0), 0);

    const receitaTotal = receitaGinasio + receitaLoja;

    if (loading) {
        return <div className="flex items-center justify-center py-20 text-muted-foreground">A carregar relatórios...</div>;
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-space font-bold">Relatórios</h1>
                <p className="text-muted-foreground text-sm">Visão geral de subscrições e vendas</p>
            </div>

            {/* Resumo geral */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Resumo Geral</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Kpi icon={TrendingUp} label="Receita total" value={fmtMT(receitaTotal)} color="text-green-500" />
                    <Kpi icon={Dumbbell} label="Receita ginásio" value={fmtMT(receitaGinasio)} sub={`${subsPagas.length} subscrições`} />
                    <Kpi icon={ShoppingCart} label="Receita loja" value={fmtMT(receitaLoja)} sub={`${vendasPagas.length} vendas`} />
                    <Kpi icon={Users} label="Clientes que pagaram" value={clientesPagaram} sub="subscrições activas/pagas" />
                </div>
            </section>

            {/* Ginásio */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Ginásio — Subscrições</h2>
                    <Button variant="outline" size="sm" className="gap-2" disabled={subsPagas.length === 0}
                        onClick={() => exportarCSV('subscricoes', [
                            { label: 'Cliente', get: s => nomeCliente(s.client_id) },
                            { label: 'Serviço', get: s => s.service_nome || '' },
                            { label: 'Valor (MT)', get: s => s.valor_pago || 0 },
                            { label: 'Estado', get: s => s.status },
                            { label: 'Início', get: s => s.data_inicio || '' },
                            { label: 'Validade', get: s => s.data_fim || '' },
                        ], subsPagas)}>
                        <Download className="w-4 h-4" /> Exportar CSV
                    </Button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Kpi icon={CreditCard} label="Subscrições activas" value={subsActivas.length} color="text-green-500" />
                    <Kpi icon={CreditCard} label="Total subscrições" value={subs.length} />
                    <Kpi icon={Users} label="Clientes pagantes" value={clientesPagaram} />
                    <Kpi icon={TrendingUp} label="Receita subscrições" value={fmtMT(receitaGinasio)} color="text-green-500" />
                </div>
                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="p-3 font-medium">Cliente</th>
                                    <th className="p-3 font-medium">Serviço</th>
                                    <th className="p-3 font-medium">Valor</th>
                                    <th className="p-3 font-medium">Estado</th>
                                    <th className="p-3 font-medium">Validade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subsPagas.slice(0, 50).map(s => (
                                    <tr key={s.id} className="border-b last:border-0">
                                        <td className="p-3 font-medium">{nomeCliente(s.client_id)}</td>
                                        <td className="p-3 text-muted-foreground">{s.service_nome || '—'}</td>
                                        <td className="p-3">{fmtMT(s.valor_pago)}</td>
                                        <td className="p-3">
                                            <Badge className={s.status === 'active' || s.status === 'activo' ? 'bg-green-100 text-green-800' : s.status === 'expired' || s.status === 'expirado' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}>
                                                {s.status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-muted-foreground">{s.data_fim ? new Date(s.data_fim).toLocaleDateString('pt-PT') : '—'}</td>
                                    </tr>
                                ))}
                                {subsPagas.length === 0 && (
                                    <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Sem subscrições.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </section>

            {/* Loja */}
            <section className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Loja — Vendas</h2>
                    <Button variant="outline" size="sm" className="gap-2" disabled={vendasPagas.length === 0}
                        onClick={() => exportarCSV('vendas', [
                            { label: 'Cliente', get: o => o.cliente_nome || nomeCliente(o.client_id) },
                            { label: 'Nº Itens', get: o => Array.isArray(o.items) ? o.items.length : 0 },
                            { label: 'Total (MT)', get: o => o.valor_total || 0 },
                            { label: 'Estado', get: o => o.status },
                            { label: 'Data', get: o => o.created_date ? new Date(o.created_date).toLocaleDateString('pt-PT') : '' },
                        ], vendasPagas)}>
                        <Download className="w-4 h-4" /> Exportar CSV
                    </Button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Kpi icon={ShoppingCart} label="Vendas pagas" value={vendasPagas.length} color="text-green-500" />
                    <Kpi icon={Package} label="Itens vendidos" value={itensVendidos} />
                    <Kpi icon={ShoppingCart} label="Total encomendas" value={orders.length} />
                    <Kpi icon={TrendingUp} label="Receita loja" value={fmtMT(receitaLoja)} color="text-green-500" />
                </div>
                <Card>
                    <CardContent className="p-0 overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b text-left text-muted-foreground">
                                    <th className="p-3 font-medium">Cliente</th>
                                    <th className="p-3 font-medium">Itens</th>
                                    <th className="p-3 font-medium">Total</th>
                                    <th className="p-3 font-medium">Estado</th>
                                    <th className="p-3 font-medium">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendasPagas.slice(0, 50).map(o => (
                                    <tr key={o.id} className="border-b last:border-0">
                                        <td className="p-3 font-medium">{o.cliente_nome || nomeCliente(o.client_id)}</td>
                                        <td className="p-3 text-muted-foreground">{Array.isArray(o.items) ? o.items.length : 0}</td>
                                        <td className="p-3">{fmtMT(o.valor_total)}</td>
                                        <td className="p-3"><Badge className="bg-green-100 text-green-800">{o.status}</Badge></td>
                                        <td className="p-3 text-muted-foreground">{o.created_date ? new Date(o.created_date).toLocaleDateString('pt-PT') : '—'}</td>
                                    </tr>
                                ))}
                                {vendasPagas.length === 0 && (
                                    <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">Sem vendas pagas.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
