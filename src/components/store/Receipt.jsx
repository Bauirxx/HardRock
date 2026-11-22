import { Button } from '@/components/ui/button';
import { Printer, CheckCircle2, Dumbbell } from 'lucide-react';

const METODO_LABEL = { mpesa: 'M-Pesa', emola: 'e-Mola', credit_card: 'Cartão', card: 'Cartão', dinheiro: 'Dinheiro' };

function formatData(iso) {
    if (!iso) return new Date().toLocaleString('pt-MZ');
    try { return new Date(iso).toLocaleString('pt-MZ'); } catch { return iso; }
}

function money(v) {
    return `${Number(v || 0).toLocaleString('pt-MZ')} MZN`;
}

// Recibo de pagamento — imprimível (Imprimir → Guardar como PDF).
export default function Receipt({ transacao = {}, config = {}, items = [], cliente, trackingCode }) {
    const nomeGinasio = config.nome || 'Hard Rock Gym';
    const numeroRecibo = transacao.referencia || trackingCode || '—';
    const metodo = METODO_LABEL[transacao.metodo] || transacao.metodo || '—';
    const total = transacao.valor;

    return (
        <div className="max-w-md mx-auto text-left">
            <div className="recibo bg-white text-gray-900 rounded-2xl border shadow-lg overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-primary text-white px-6 py-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="font-space font-bold text-lg leading-tight">{nomeGinasio}</p>
                        <p className="text-white/80 text-xs">Recibo de Pagamento</p>
                    </div>
                </div>

                <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="font-semibold">Pagamento confirmado</span>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <span className="text-gray-500">Nº do recibo</span>
                        <span className="text-right font-mono font-medium break-all">{numeroRecibo}</span>

                        <span className="text-gray-500">Data</span>
                        <span className="text-right">{formatData(transacao.paid_at)}</span>

                        <span className="text-gray-500">Método</span>
                        <span className="text-right">{metodo}</span>

                        {transacao.transaction_id && (
                            <>
                                <span className="text-gray-500">Transação</span>
                                <span className="text-right font-mono text-xs break-all">{transacao.transaction_id}</span>
                            </>
                        )}

                        {cliente && (
                            <>
                                <span className="text-gray-500">Cliente</span>
                                <span className="text-right">{cliente}</span>
                            </>
                        )}
                    </div>

                    <div className="border-t border-dashed pt-3">
                        {items.length > 0 ? (
                            <div className="space-y-1.5 text-sm">
                                {items.map((it, i) => (
                                    <div key={i} className="flex justify-between">
                                        <span className="text-gray-700">{it.nome} × {it.quantidade}</span>
                                        <span>{money((it.preco || 0) * (it.quantidade || 1))}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">{transacao.descricao || 'Pagamento'}</p>
                        )}
                    </div>

                    <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-semibold">Total pago</span>
                        <span className="font-space font-bold text-xl text-primary">{money(total)}</span>
                    </div>

                    <div className="text-center pt-2">
                        <p className="text-xs text-gray-400">Processado com segurança via PaySuite</p>
                        {config.telefone || config.whatsapp_number ? (
                            <p className="text-xs text-gray-400">{config.whatsapp_number || config.telefone}</p>
                        ) : null}
                        <p className="text-[10px] text-gray-300 mt-2">Obrigado pela sua preferência • {nomeGinasio}</p>
                    </div>
                </div>
            </div>

            {/* Ações — não aparecem na impressão */}
            <div className="no-print mt-4 flex justify-center">
                <Button onClick={() => window.print()} className="gap-2">
                    <Printer className="w-4 h-4" /> Imprimir / Guardar recibo
                </Button>
            </div>
        </div>
    );
}
