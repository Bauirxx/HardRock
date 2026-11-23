import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Package, ShoppingCart, CreditCard,
    UserPlus, Settings, Dumbbell, ChevronLeft, MessageSquare,
    CalendarCheck, BadgeCheck, PanelLeftClose, PanelLeftOpen, Sparkles, ClipboardList, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuSections = [
    {
        title: null,
        items: [
            { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
        ],
    },
    {
        title: 'Ginásio',
        items: [
            { to: '/admin/clientes', icon: Users, label: 'Clientes' },
            { to: '/admin/trainers', icon: Dumbbell, label: 'Personal Trainers' },
            { to: '/admin/subscricoes', icon: CalendarCheck, label: 'Subscrições' },
            { to: '/admin/servicos', icon: BadgeCheck, label: 'Planos & Serviços' },
            { to: '/admin/inscricoes', icon: ClipboardList, label: 'Pedidos Inscrição' },
            { to: '/admin/transformacoes', icon: Sparkles, label: 'Histórias de Sucesso' },
        ],
    },
    {
        title: 'Loja',
        items: [
            { to: '/admin/produtos', icon: Package, label: 'Produtos' },
            { to: '/admin/encomendas', icon: ShoppingCart, label: 'Encomendas' },
        ],
    },
    {
        title: 'Geral',
        items: [
            { to: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' },
            { to: '/admin/pagamentos', icon: CreditCard, label: 'Pagamentos' },
            { to: '/admin/leads', icon: UserPlus, label: 'Leads' },
            { to: '/admin/depoimentos', icon: MessageSquare, label: 'Depoimentos' },
            { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
        ],
    },
];

export default function AdminSidebar({ collapsed, onToggle }) {
    const location = useLocation();

    return (
        <aside className={cn(
            "fixed left-0 top-0 bottom-0 z-40 bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 flex flex-col",
            collapsed ? "w-16" : "w-64"
        )}>
            <div className="flex items-center gap-2 h-16 px-4 border-b border-sidebar-border">
                <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0 border border-primary">
                    <Dumbbell className="w-4 h-4 text-primary" />
                </div>
                {!collapsed && (
                    <span className="font-space font-bold text-lg uppercase tracking-tighter italic flex-1">
                        <span className="text-primary">Hard Rock</span> Gym
                    </span>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggle}
                    className="shrink-0 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent w-8 h-8"
                    title={collapsed ? 'Expandir menu' : 'Colapsar menu'}
                >
                    {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
                </Button>
            </div>

            <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                {menuSections.map((section, si) => (
                    <div key={si} className={si > 0 ? 'pt-3' : ''}>
                        {section.title && !collapsed && (
                            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40">
                                {section.title}
                            </p>
                        )}
                        {section.title && collapsed && si > 0 && (
                            <div className="mx-2 my-2 border-t border-sidebar-border/50" />
                        )}
                        {section.items.map(item => {
                            const isActive = location.pathname === item.to ||
                                (item.to !== '/admin' && location.pathname.startsWith(item.to));
                            return (
                                <Link key={item.to} to={item.to}>
                                    <Button
                                        variant="ghost"
                                        className={cn(
                                            "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
                                            isActive && "bg-sidebar-accent text-sidebar-foreground font-medium",
                                            collapsed && "justify-center px-0"
                                        )}
                                    >
                                        <item.icon className="w-5 h-5 shrink-0" />
                                        {!collapsed && <span>{item.label}</span>}
                                    </Button>
                                </Link>
                            );
                        })}
                    </div>
                ))}
            </nav>

            <div className="p-2 border-t border-sidebar-border">
                <Link to="/">
                    <Button variant="ghost" className={cn(
                        "w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground",
                        collapsed && "justify-center px-0"
                    )}>
                        <ChevronLeft className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>Voltar ao Site</span>}
                    </Button>
                </Link>
                {!collapsed && (
                    <p className="text-[10px] text-center text-sidebar-foreground/40 mt-2 px-2">
                        Desenvolvido por<br />
                        <span className="text-primary font-medium">Arsénio Francisco Baquir</span>
                    </p>
                )}
            </div>
        </aside>
    );
}
