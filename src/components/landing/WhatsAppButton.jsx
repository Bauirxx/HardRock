import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSiteConfig } from '@/lib/useSiteConfig';

export default function WhatsAppButton({ phone }) {
    const cfg = useSiteConfig();
    const numero = phone || cfg.whatsapp_number || cfg.telefone;

    // Sem número configurado → não mostra o botão
    if (!numero) return null;

    const url = `https://wa.me/${String(numero).replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Olá! Gostaria de saber mais informações sobre o ginásio.')}`;

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: 'spring' }}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all"
            title="WhatsApp"
        >
            <MessageCircle className="w-7 h-7 text-white" />
        </motion.a>
    );
}
