import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard, Users, Package, ShoppingCart, CreditCard,
    UserPlus, FileText, Settings, Dumbbell, ChevronLeft, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const menuItems = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/clientes', icon: Users, label: 'Clientes' },
    { to: '/admin/trainers', icon: Dumbbell, label: 'Personal Trainers' },
    { to: '/admin/produtos', icon: Package, label: 'Produtos' },
    { to: '/admin/encomendas', icon: ShoppingCart, label: 'Encomendas' },
    { to: '/admin/pagamentos', icon: CreditCard, label: 'Pagamentos' },
    { to: '/admin/leads', icon: UserPlus, label: 'Leads' },
    { to: '/admin/servicos', icon: Dumbbell, label: 'Serviços' },
    { to: '/admin/depoimentos', icon: MessageSquare, label: 'Depoimentos' },
    { to: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
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
                    <span className="font-space font-bold text-lg uppercase tracking-tighter italic">
                        <span className="text-primary">Hard Rock</span> Gym
                    </span>
                )}
            </div>

            <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
                {menuItems.map(item => {
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
            </div>
        </aside>
    );
}