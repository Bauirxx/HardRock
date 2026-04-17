import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, Dumbbell, User, LogIn, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { getCartCount } from '@/lib/cartStore';

<<<<<<< HEAD
export default function Navbar() {
=======
export default function Navbar({ tenantName = "Hard Rock Gym" }) {
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(getCartCount());
    const [open, setOpen] = useState(false);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = () => setCartCount(getCartCount());
        window.addEventListener('cart-updated', handler);
        return () => window.removeEventListener('cart-updated', handler);
    }, []);

    useEffect(() => {
        base44.auth.me().then(setAuthUser).catch(() => setAuthUser(null));
    }, []);

    const links = [
        { to: '/', label: 'Início' },
        { to: '/loja', label: 'Loja' },
        { to: '/equipamentos', label: 'Equipamentos' },
        { to: '/rastreio', label: 'Rastreio' },
    ];

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    <Link to="/" className="flex items-center gap-2">
<<<<<<< HEAD
                        <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/30">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-space font-bold text-xl uppercase tracking-tighter">
                            <span className={scrolled ? "text-foreground" : "text-white"}>Hard</span>{' '}
                            <span className="text-primary">Rock</span>{' '}
                            <span className={scrolled ? "text-foreground" : "text-white"}>Gym</span>
=======
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-space font-bold text-xl uppercase tracking-tighter">
                            <span className="text-white">Hard</span>{' '}
                            <span className="text-primary">Rock</span>{' '}
                            <span className="text-white">Gym</span>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1">
                        {links.map(link => (
                            <Link key={link.to} to={link.to}>
                                <Button variant={location.pathname === link.to ? "default" : "ghost"} size="sm" className={!scrolled && location.pathname !== link.to ? "text-white hover:text-white hover:bg-white/10" : ""}>
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        <Link to="/carrinho" className="relative">
                            <Button variant="ghost" size="icon" className={!scrolled ? "text-white" : ""}>
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs animate-pulse-glow">
                                        {cartCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>
                        {authUser ? (
                            <>
                                {(authUser.role === 'staff' || authUser.role === 'admin') && (
                                    <Link to="/admin" className="hidden sm:block">
                                        <Button variant="outline" size="sm" className="gap-2 border-primary/50 text-white hover:bg-primary/20">
                                            <Menu className="w-4 h-4" /> Gestão
                                        </Button>
                                    </Link>
                                )}
                                {(authUser.role === 'internal_client' || authUser.role === 'external_client' || authUser.role === 'admin') && (
                                    <Link to="/cliente" className="hidden sm:block">
                                        <Button variant="outline" size="sm" className="gap-2 border-white/20 text-white hover:bg-white/10">
                                            <User className="w-4 h-4" /> {authUser.full_name?.split(' ')[0] || 'Minha Conta'}
                                        </Button>
                                    </Link>
                                )}
                                <Button variant="ghost" size="sm" className="hidden sm:flex gap-2 text-white/70 hover:text-white" onClick={() => { base44.auth.logout('/'); }}>
                                    <LogOut className="w-4 h-4" /> Sair
                                </Button>
                            </>
                        ) : (
                            <Button variant="default" size="sm" className="hidden sm:flex gap-2" onClick={() => base44.auth.redirectToLogin(window.location.href)}>
                                <LogIn className="w-4 h-4" /> Entrar
                            </Button>
                        )}

                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className={!scrolled ? "text-white" : ""}>
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
<<<<<<< HEAD
                            <SheetContent side="right" className="w-72 bg-background text-foreground border-border">
                                <div className="flex flex-col gap-2 mt-8">
                                    {links.map(link => (
                                        <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                                            <Button variant={location.pathname === link.to ? "default" : "ghost"} className="w-full justify-start">
=======
                            <SheetContent side="right" className="w-72 bg-slate-950 text-white border-slate-800">
                                <div className="flex flex-col gap-2 mt-8">
                                    {links.map(link => (
                                        <Link key={link.to} to={link.to} onClick={() => setOpen(false)}>
                                            <Button variant={location.pathname === link.to ? "default" : "ghost"} className="w-full justify-start text-inherit">
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                                {link.label}
                                            </Button>
                                        </Link>
                                    ))}
<<<<<<< HEAD
                                    <hr className="my-2 border-border" />
                                    {authUser && (
                                        <Link to="/cliente" onClick={() => setOpen(false)}>
                                            <Button variant="outline" className="w-full justify-start gap-2">
                                                <User className="w-4 h-4" /> Área Pessoal
                                            </Button>
                                        </Link>
                                    )}
=======
                                    <hr className="my-2 border-slate-800" />
                                    <Link to="/cliente" onClick={() => setOpen(false)}>
                                        <Button variant="outline" className="w-full justify-start gap-2 border-slate-700">
                                            <User className="w-4 h-4" /> Área Pessoal
                                        </Button>
                                    </Link>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
                                    {(authUser?.role === 'admin' || authUser?.role === 'staff') && (
                                        <Link to="/admin" onClick={() => setOpen(false)}>
                                            <Button className="w-full">Painel Gestão</Button>
                                        </Link>
                                    )}
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}