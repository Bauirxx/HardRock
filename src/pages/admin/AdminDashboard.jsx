import { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import RequireRole from '../../components/auth/RequireRole';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Package, ShoppingCart, CreditCard, UserPlus, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import moment from 'moment';

function AdminDashboardContent() {
    const [stats, setStats] = useState({ clients: 0, products: 0, orders: 0, leads: 0, revenue: 0, pendingOrders: 0 });
    const [recentOrders, setRecentOrders] = useState([]);
    const [recentLeads, setRecentLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { loadDashboard(); }, []);

    const loadDashboard = async () => {
        const [clients, products, orders, leads, payments] = await Promise.all([
            base44.entities.Client.list(),
            base44.entities.Product.list(),
            base44.entities.Order.list('-created_date', 50),
            base44.entities.Lead.list('-created_date', 20),
            base44.entities.Payment.filter({ status: 'completed' }),
        ]);
        const revenue = payments.reduce((sum, p) => sum + (p.valor || 0), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        setStats({ clients: clients.length, products: products.length, orders: orders.length, leads: leads.length, revenue, pendingOrders });
        setRecentOrders(orders.slice(0, 5));
        setRecentLeads(leads.slice(0, 5));
        setLoading(false);
    };

    const statCards = [
        { label: 'Receita Total', value: `${stats.revenue.toLocaleString()} MZN`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
        { label: 'Clientes', value: stats.clients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'Encomendas', value: stats.orders, icon: ShoppingCart, color: 'text-purple-500', bg: 'bg-purple-50' },
        { label: 'Leads', value: stats.leads, icon: UserPlus, color: 'text-orange-500', bg: 'bg-orange-50' },
        { label: 'Produtos', value: stats.products, icon: Package, color: 'text-pink-500', bg: 'bg-pink-50' },
        { label: 'Pendentes', value: stats.pendingOrders, icon: CreditCard, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    ];

    return (
        <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl sm:text-3xl font-space font-bold mb-1">Dashboard</h1>
                <p className="text-muted-foreground mb-6">Visão geral do seu ginásio.</p>
            </motion.div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {statCards.map((stat, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Card>
                            <CardContent className="p-4 sm:p-5">
                                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <p className="text-2xl font-space font-bold">{loading ? '...' : stat.value}</p>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader><CardTitle className="text-lg">Encomendas Recentes</CardTitle></CardHeader>
                    <CardContent>
                        {recentOrders.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">Sem encomendas</p>
                        ) : (
                            <div className="space-y-3">
                                {recentOrders.map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div>
                                            <p className="font-mono text-sm font-medium">{order.tracking_code || 'Sem código'}</p>
                                            <p className="text-xs text-muted-foreground">{order.guest_name || 'Cliente'} • {moment(order.created_date).fromNow()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold text-sm">{order.total?.toLocaleString()} MZN</p>
                                            <Badge variant="outline" className="text-xs">{order.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle className="text-lg">Leads Recentes</CardTitle></CardHeader>
                    <CardContent>
                        {recentLeads.length === 0 ? (
                            <p className="text-center text-muted-foreground py-6">Sem leads</p>
                        ) : (
                            <div className="space-y-3">
                                {recentLeads.map(lead => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div>
                                            <p className="font-medium text-sm">{lead.nome}</p>
                                            <p className="text-xs text-muted-foreground">{lead.telefone} • {moment(lead.created_date).fromNow()}</p>
                                        </div>
                                        <Badge className={lead.status === 'new' ? 'bg-green-100 text-green-800' : lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>{lead.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default function AdminDashboard() {
    return (
        <RequireRole roles={['admin']}>
            <AdminDashboardContent />
        </RequireRole>
    );
}