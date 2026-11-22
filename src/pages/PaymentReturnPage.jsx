import { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import { Button } from '@/components/ui/button';
import { XCircle, Loader2, Home, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/lib/useSiteConfig';
import Receipt from '../components/store/Receipt';

// Página de retorno após o pagamento no PaySuite. Consulta o estado
// (que refresca do gateway) até confirmar PAGO ou FALHOU, e emite o recibo.
export default function PaymentReturnPage() {
    const [params] = useSearchParams();
    const config = useSiteConfig();
    const referencia = params.get('ref');
    const trackingCode = params.get('code');
    const [estado, setEstado] = useState('PENDING');
    const [transacao, setTransacao] = useState(null);
    const [items, setItems] = useState([]);
    const [tentativas, setTentativas] = useState(0);
    const timer = useRef(null);

    useEffect(() => {
        if (!referencia) { setEstado('SEM_REF'); return; }

        let cancelado = false;
        const verificar = async () => {
            try {
                const t = await base44.payments.status(referencia);
                if (cancelado) return;
                if (t?.estado === 'PAID' || t?.estado === 'FAILED' || t?.estado === 'CANCELLED') {
                    setTransacao(t);
                    setEstado(t.estado);
                    if (t.estado === 'PAID') carregarItens(t);
                    return;
                }
            } catch { /* continua a tentar */ }
            if (!cancelado) {
                setTentativas(n => n + 1);
                timer.current = setTimeout(verificar, 4000);
            }
        };
        verificar();

        return () => { cancelado = true; if (timer.current) clearTimeout(timer.current); };
    }, [referencia]);

    // Para a venda: buscar os itens e os nomes dos produtos para o recibo
    const carregarItens = async (t) => {
        if (t.contexto !== 'VENDA' || !t.contexto_id) return;
        try {
            const [venda, produtos] = await Promise.all([
                base44.entities.Order.get(t.contexto_id).catch(() => null),
                base44.entities.Product.list('-created_date', 200).catch(() => []),
            ]);
            const mapaNomes = Object.fromEntries((produtos || []).map(p => [p.id, p.nome]));
            const linhas = (venda?.items || []).map(it => ({
                nome: mapaNomes[it.produto_id] || it.nome || 'Produto',
                quantidade: it.quantidade,
                preco: it.preco_unitario ?? it.preco,
            }));
            setItems(linhas);
        } catch { /* recibo mostra a descrição */ }
    };

    const desistiu = tentativas > 30 && estado === 'PENDING';
    const pago = estado === 'PAID';
    const falhou = estado === 'FAILED' || estado === 'CANCELLED';
    const aguardar = !pago && !falhou && !desistiu && estado !== 'SEM_REF';

    return (
        <div className="min-h-screen">
            <div className="no-print"><Navbar /></div>
            <div className="pt-32 pb-16 max-w-lg mx-auto px-4 text-center">
                {aguardar && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <Loader2 className="w-14 h-14 text-primary mx-auto mb-6 animate-spin" />
                        <h1 className="text-2xl font-space font-bold mb-2">A confirmar o pagamento…</h1>
                        <p className="text-muted-foreground">
                            Estamos a validar a tua transação com o gateway. Não feches esta página.
                        </p>
                    </motion.div>
                )}

                {pago && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="text-2xl font-space font-bold mb-6 no-print">Pagamento confirmado! 🎉</h1>
                        <Receipt
                            transacao={transacao || {}}
                            config={config}
                            items={items}
                            trackingCode={trackingCode}
                        />
                        <div className="no-print mt-6 flex gap-3 justify-center">
                            <Link to="/loja"><Button variant="outline" className="gap-2"><ShoppingBag className="w-4 h-4" /> Continuar a comprar</Button></Link>
                            <Link to="/"><Button className="gap-2"><Home className="w-4 h-4" /> Início</Button></Link>
                        </div>
                    </motion.div>
                )}

                {(falhou || desistiu || estado === 'SEM_REF') && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                            <XCircle className="w-10 h-10 text-destructive" />
                        </div>
                        <h1 className="text-2xl font-space font-bold mb-2">
                            {desistiu ? 'Ainda a aguardar…' : 'Pagamento não concluído'}
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            {desistiu
                                ? 'O pagamento pode demorar. Verifica mais tarde o estado da tua encomenda.'
                                : 'A transação não foi concluída. Podes tentar novamente.'}
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Link to="/loja"><Button variant="outline">Voltar à loja</Button></Link>
                            <Link to="/"><Button className="gap-2"><Home className="w-4 h-4" /> Início</Button></Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
