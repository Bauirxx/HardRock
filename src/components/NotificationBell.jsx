import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Bell, X, CheckCheck, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPO_ICONS = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: XCircle,
};

const TIPO_COLORS = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    success: 'text-green-400',
    error: 'text-red-400',
};

export default function NotificationBell({ userId }) {
    const [notifs, setNotifs] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!userId) return;
        const load = () => base44.notifications.list(userId).then(setNotifs).catch(() => {});
        load();
        const interval = setInterval(load, 60000);
        return () => clearInterval(interval);
    }, [userId]);

    const unread = notifs.filter(n => !n.lida).length;

    const markRead = async (id) => {
        await base44.notifications.markRead(id);
        setNotifs(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
    };

    const markAllRead = async () => {
        await Promise.all(notifs.filter(n => !n.lida).map(n => base44.notifications.markRead(n.id)));
        setNotifs(prev => prev.map(n => ({ ...n, lida: true })));
    };

    const deleteNotif = async (id) => {
        await base44.notifications.delete(id);
        setNotifs(prev => prev.filter(n => n.id !== id));
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(o => !o)}
                className="relative p-2 rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Notificações"
            >
                <Bell className="w-5 h-5 text-white/80" />
                {unread > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                    >
                        {unread > 9 ? '9+' : unread}
                    </motion.span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-white/10 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                                <h3 className="font-semibold text-sm">Notificações</h3>
                                {unread > 0 && (
                                    <button onClick={markAllRead} className="text-xs text-primary hover:underline flex items-center gap-1">
                                        <CheckCheck className="w-3 h-3" /> Marcar todas
                                    </button>
                                )}
                            </div>

                            <div className="max-h-96 overflow-y-auto">
                                {notifs.length === 0 ? (
                                    <div className="py-8 text-center text-sm text-muted-foreground">
                                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                        Nenhuma notificação
                                    </div>
                                ) : notifs.map(n => {
                                    const Icon = TIPO_ICONS[n.tipo] || Info;
                                    return (
                                        <div
                                            key={n.id}
                                            className={`flex gap-3 px-4 py-3 border-b border-white/5 transition-colors cursor-pointer hover:bg-white/5 ${!n.lida ? 'bg-primary/5' : ''}`}
                                            onClick={() => markRead(n.id)}
                                        >
                                            <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${TIPO_COLORS[n.tipo] || 'text-white/60'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium leading-tight ${n.lida ? 'text-white/70' : 'text-white'}`}>{n.titulo}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.mensagem}</p>
                                                <p className="text-xs text-muted-foreground/60 mt-1">
                                                    {new Date(n.created_date).toLocaleDateString('pt-MZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                            <button
                                                onClick={e => { e.stopPropagation(); deleteNotif(n.id); }}
                                                className="p-1 rounded hover:bg-white/10 text-muted-foreground hover:text-white transition-colors flex-shrink-0"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
