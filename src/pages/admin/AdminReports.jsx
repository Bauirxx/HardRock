import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, ShoppingCart, Users, TrendingUp, CreditCard, Package, Download, FileText } from 'lucide-react';

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

    // ── Demografia dos clientes ──
    const totalClientes = clients.length;
    const activos = clients.filter(c => c.status !== 'inactive').length;
    const internos = clients.filter(c => (c.tipo_cliente || c.tipo) === 'INTERNO').length;
    const externos = clients.filter(c => (c.tipo_cliente || c.tipo) === 'EXTERNO').length;

    const normSexo = (s) => {
        const v = (s || '').toString().toUpperCase();
        if (v.startsWith('M')) return 'Masculino';
        if (v.startsWith('F')) return 'Feminino';
        if (v.startsWith('O')) return 'Outro';
        return 'N/D';
    };
    const porSexo = clients.reduce((acc, c) => {
        const k = normSexo(c.sexo);
        acc[k] = (acc[k] || 0) + 1;
        return acc;
    }, {});

    const FAIXAS = [
        { label: '< 18', min: 0, max: 17 },
        { label: '18-25', min: 18, max: 25 },
        { label: '26-35', min: 26, max: 35 },
        { label: '36-50', min: 36, max: 50 },
        { label: '> 50', min: 51, max: 200 },
    ];
    const porIdade = FAIXAS.map(f => ({
        label: f.label,
        count: clients.filter(c => { const i = parseInt(c.idade); return !isNaN(i) && i >= f.min && i <= f.max; }).length,
    }));
    const semIdade = clients.filter(c => isNaN(parseInt(c.idade))).length;

    const gerarRelatorioPDF = () => {
        const hoje = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
        const linhasSexo = Object.entries(porSexo).map(([k, v]) =>
            `<tr><td>${k}</td><td style="text-align:right">${v}</td><td style="text-align:right">${totalClientes ? Math.round(v / totalClientes * 100) : 0}%</td></tr>`).join('');
        const linhasIdade = porIdade.map(f =>
            `<tr><td>${f.label} anos</td><td style="text-align:right">${f.count}</td><td style="text-align:right">${totalClientes ? Math.round(f.count / totalClientes * 100) : 0}%</td></tr>`).join('')
            + (semIdade ? `<tr><td>Sem idade</td><td style="text-align:right">${semIdade}</td><td style="text-align:right">${Math.round(semIdade / totalClientes * 100)}%</td></tr>` : '');
        const linhasSubs = subsPagas.slice(0, 100).map(s =>
            `<tr><td>${nomeCliente(s.client_id)}</td><td>${s.service_nome || '—'}</td><td style="text-align:right">${fmtMT(s.valor_pago)}</td><td>${s.status}</td><td>${s.data_fim ? new Date(s.data_fim).toLocaleDateString('pt-PT') : '—'}</td></tr>`).join('');
        const linhasVendas = vendasPagas.slice(0, 100).map(o =>
            `<tr><td>${o.cliente_nome || nomeCliente(o.client_id)}</td><td style="text-align:right">${Array.isArray(o.items) ? o.items.length : 0}</td><td style="text-align:right">${fmtMT(o.valor_total)}</td><td>${o.created_date ? new Date(o.created_date).toLocaleDateString('pt-PT') : '—'}</td></tr>`).join('');

        const html = `<!doctype html><html lang="pt"><head><meta charset="utf-8"><title>Relatório Larius Sport</title>
<style>
  @page { margin: 24mm 16mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a1a; margin: 0; }
  .brand { font-size: 26px; font-weight: 800; letter-spacing: -1px; text-transform: uppercase; font-style: italic; }
  .brand .s { color: #dc2626; }
  header { border-bottom: 3px solid #dc2626; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
  h1 { font-size: 18px; margin: 18px 0 4px; }
  h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #dc2626; border-bottom: 1px solid #eee; padding-bottom: 4px; margin: 22px 0 10px; }
  .meta { color: #666; font-size: 12px; }
  .kpis { display: flex; flex-wrap: wrap; gap: 10px; margin: 10px 0; }
  .kpi { flex: 1; min-width: 120px; border: 1px solid #e5e5e5; border-radius: 8px; padding: 10px 12px; }
  .kpi .l { font-size: 10px; color: #777; text-transform: uppercase; }
  .kpi .v { font-size: 18px; font-weight: 700; }
  table { width: 100%; border-collapse: collapse; font-size: 11px; margin: 6px 0 14px; }
  th { text-align: left; background: #f5f5f5; padding: 6px 8px; border-bottom: 2px solid #ddd; font-size: 10px; text-transform: uppercase; color: #555; }
  td { padding: 5px 8px; border-bottom: 1px solid #eee; }
  .half { display: flex; gap: 24px; }
  .half > div { flex: 1; }
  footer { margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px; color: #999; font-size: 10px; text-align: center; }
</style></head><body>
  <header>
    <div>
      <div class="brand">Larius<span class="s">Sport</span></div>
      <div class="meta">Relatório de Gestão</div>
    </div>
    <div class="meta">Gerado em ${hoje}</div>
  </header>

  <h1>Resumo Financeiro</h1>
  <div class="kpis">
    <div class="kpi"><div class="l">Receita total</div><div class="v">${fmtMT(receitaTotal)}</div></div>
    <div class="kpi"><div class="l">Receita ginásio</div><div class="v">${fmtMT(receitaGinasio)}</div></div>
    <div class="kpi"><div class="l">Receita loja</div><div class="v">${fmtMT(receitaLoja)}</div></div>
  </div>

  <h2>Clientes — Demografia</h2>
  <div class="kpis">
    <div class="kpi"><div class="l">Total de clientes</div><div class="v">${totalClientes}</div></div>
    <div class="kpi"><div class="l">Activos</div><div class="v">${activos}</div></div>
    <div class="kpi"><div class="l">Membros internos</div><div class="v">${internos}</div></div>
    <div class="kpi"><div class="l">Externos (app)</div><div class="v">${externos}</div></div>
  </div>
  <div class="half">
    <div>
      <table><thead><tr><th>Sexo</th><th style="text-align:right">Nº</th><th style="text-align:right">%</th></tr></thead><tbody>${linhasSexo || '<tr><td colspan=3>Sem dados</td></tr>'}</tbody></table>
    </div>
    <div>
      <table><thead><tr><th>Faixa etária</th><th style="text-align:right">Nº</th><th style="text-align:right">%</th></tr></thead><tbody>${linhasIdade}</tbody></table>
    </div>
  </div>

  <h2>Ginásio — Subscrições (${subsPagas.length}) · Receita ${fmtMT(receitaGinasio)}</h2>
  <table><thead><tr><th>Cliente</th><th>Serviço</th><th style="text-align:right">Valor</th><th>Estado</th><th>Validade</th></tr></thead>
  <tbody>${linhasSubs || '<tr><td colspan=5>Sem subscrições</td></tr>'}</tbody></table>

  <h2>Loja — Vendas (${vendasPagas.length}) · Receita ${fmtMT(receitaLoja)}</h2>
  <table><thead><tr><th>Cliente</th><th style="text-align:right">Itens</th><th style="text-align:right">Total</th><th>Data</th></tr></thead>
  <tbody>${linhasVendas || '<tr><td colspan=4>Sem vendas</td></tr>'}</tbody></table>

  <footer>Larius Sport • Relatório gerado automaticamente em ${hoje}</footer>
  <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 300); };</script>
</body></html>`;

        const w = window.open('', '_blank');
        if (!w) { alert('Permite popups para gerar o PDF.'); return; }
        w.document.write(html);
        w.document.close();
    };

    if (loading) {
        return <div className="flex items-center justify-center py-20 text-muted-foreground">A carregar relatórios...</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                    <h1 className="text-2xl font-space font-bold">Relatórios</h1>
                    <p className="text-muted-foreground text-sm">Visão geral de clientes, subscrições e vendas</p>
                </div>
                <Button className="gap-2" onClick={gerarRelatorioPDF}>
                    <FileText className="w-4 h-4" /> Exportar PDF (Larius Sport)
                </Button>
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

            {/* Clientes — Demografia */}
            <section className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Clientes — Demografia</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <Kpi icon={Users} label="Total de clientes" value={totalClientes} />
                    <Kpi icon={Users} label="Activos" value={activos} color="text-green-500" />
                    <Kpi icon={Dumbbell} label="Membros internos" value={internos} />
                    <Kpi icon={ShoppingCart} label="Externos (app)" value={externos} />
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm font-semibold mb-3">Por sexo</p>
                            <div className="space-y-2">
                                {Object.entries(porSexo).map(([k, v]) => (
                                    <div key={k}>
                                        <div className="flex justify-between text-xs mb-1"><span>{k}</span><span className="text-muted-foreground">{v} ({totalClientes ? Math.round(v / totalClientes * 100) : 0}%)</span></div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary" style={{ width: `${totalClientes ? (v / totalClientes * 100) : 0}%` }} /></div>
                                    </div>
                                ))}
                                {totalClientes === 0 && <p className="text-xs text-muted-foreground">Sem dados.</p>}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4">
                            <p className="text-sm font-semibold mb-3">Por faixa etária</p>
                            <div className="space-y-2">
                                {porIdade.map(f => (
                                    <div key={f.label}>
                                        <div className="flex justify-between text-xs mb-1"><span>{f.label} anos</span><span className="text-muted-foreground">{f.count} ({totalClientes ? Math.round(f.count / totalClientes * 100) : 0}%)</span></div>
                                        <div className="h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-primary" style={{ width: `${totalClientes ? (f.count / totalClientes * 100) : 0}%` }} /></div>
                                    </div>
                                ))}
                                {semIdade > 0 && <p className="text-xs text-muted-foreground mt-1">{semIdade} sem idade registada</p>}
                            </div>
                        </CardContent>
                    </Card>
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
