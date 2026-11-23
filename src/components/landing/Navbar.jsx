import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Dumbbell, User, LogIn, LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { getCartCount } from '@/lib/cartStore';

function HamburgerIcon({ open }) {
    return (
        <div className="w-5 h-5 relative flex flex-col justify-center items-center">
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-300 absolute ${open ? 'rotate-45 top-[9px]' : 'top-[4px]'}`} />
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-200 ${open ? 'opacity-0 scale-x-0' : 'opacity-100'}`} />
            <span className={`block w-5 h-0.5 bg-current rounded transition-all duration-300 absolute ${open ? '-rotate-45 bottom-[9px]' : 'bottom-[4px]'}`} />
        </div>
    );
}

export default function Navbar() {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [cartCount, setCartCount] = useState(getCartCount());
    const [open, setOpen] = useState(false);
    const [authUser, setAuthUser] = useState(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        const handler = () => setCartCount(getCartCount());
        window.addEventListener('cart-updated', handler);
        return () => window.removeEventListener('cart-updated', handler);
    }, []);

    useEffect(() => {
        if (!localStorage.getItem('auth_token')) {
            setAuthUser(null);
            return;
        }
        base44.auth.me().then(setAuthUser).catch(() => setAuthUser(null));
    }, []);

    const textClass = !scrolled ? 'text-white' : '';

    // Marca contextual: Hard Rock no ginásio, LariusSport na loja (mesma app)
    const noGinasio = location.pathname.startsWith('/ginasio');

    // Navegação contextual: menu da loja vs menu do ginásio
    const storeLinks = [
        { to: '/', label: 'Início' },
        { to: '/loja', label: 'Loja' },
        { to: '/ginasio', label: 'Ginásio' },
        { to: '/equipamentos', label: 'Equipamentos' },
        { to: '/rastreio', label: 'Rastreio' },
    ];
    const gymLinks = [
        { to: '/ginasio', label: 'Ginásio' },
        { to: '/ginasio#planos', label: 'Planos' },
        { to: '/ginasio/inscricao', label: 'Inscrever-me' },
        { to: '/loja', label: 'Loja Online' },
    ];
    const links = noGinasio ? gymLinks : storeLinks;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? 'bg-background/95 backdrop-blur-xl shadow-lg border-b' : 'bg-transparent'
            }`}
            role="navigation"
            aria-label="Navegação principal"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link to={noGinasio ? '/ginasio' : '/'} className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center shadow-lg shadow-primary/30">
                            <Dumbbell className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-space font-bold text-lg sm:text-xl uppercase tracking-tighter">
                            {noGinasio ? (
                                <>
                                    <span className={scrolled ? 'text-foreground' : 'text-white'}>Hard</span>{' '}
                                    <span className="text-primary">Rock</span>{' '}
                                    <span className={scrolled ? 'text-foreground' : 'text-white'}>Gym</span>
                                </>
                            ) : (
                                <>
                                    <span className={scrolled ? 'text-foreground' : 'text-white'}>Larius</span>
                                    <span className="text-primary">Sport</span>
                                </>
                            )}
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {links.map(link => (
                            <Link key={link.to} to={link.to}>
                                <Button
                                    variant={location.pathname === link.to ? 'default' : 'ghost'}
                                    size="sm"
                                    className={!scrolled && location.pathname !== link.to ? 'text-white hover:text-white hover:bg-white/10' : ''}
                                >
                                    {link.label}
                                </Button>
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Cart */}
                        <Link to="/carrinho" className="relative" aria-label={`Carrinho (${cartCount} items)`}>
                            <Button variant="ghost" size="icon" className={textClass}>
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs">
                                        {cartCount}
                                    </Badge>
                                )}
                            </Button>
                        </Link>

                        {/* Desktop auth buttons */}
                        {authUser ? (
                            <>
                                {(authUser.role === 'staff' || authUser.role === 'admin') && (
                                    <Link to="/admin" className="hidden sm:block">
                                        <Button variant="outline" size="sm" className={`gap-2 ${!scrolled ? 'border-primary/50 text-white hover:bg-primary/20' : ''}`}>
                                            Gestão
                                        </Button>
                                    </Link>
                                )}
                                <Link to="/cliente" className="hidden sm:block">
                                    <Button variant="outline" size="sm" className={`gap-2 ${!scrolled ? 'border-white/20 text-white hover:bg-white/10' : ''}`}>
                                        <User className="w-4 h-4" />
                                        {authUser.full_name?.split(' ')[0] || 'Conta'}
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm"
                                    className={`hidden sm:flex gap-2 ${!scrolled ? 'text-white/70 hover:text-white' : ''}`}
                                    onClick={() => base44.auth.logout('/')}>
                                    <LogOut className="w-4 h-4" /> Sair
                                </Button>
                            </>
                        ) : (
                            <Button variant="default" size="sm" className="hidden sm:flex gap-2"
                                onClick={() => base44.auth.redirectToLogin(window.location.href)}>
                                <LogIn className="w-4 h-4" /> Entrar
                            </Button>
                        )}

                        {/* Mobile hamburger menu */}
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild className="md:hidden">
                                <Button variant="ghost" size="icon" className={textClass} aria-label="Menu">
                                    <HamburgerIcon open={open} />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-72 bg-background border-border p-0">
                                <div className="flex flex-col h-full">
                                    {/* Mobile header */}
                                    <div className="px-6 pt-6 pb-4 border-b border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center">
                                                <Dumbbell className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="font-space font-bold text-sm uppercase tracking-tight">
                                                {noGinasio
                                                    ? <>Hard <span className="text-primary">Rock</span> Gym</>
                                                    : <>Larius<span className="text-primary">Sport</span></>}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Mobile nav links */}
                                    <div className="flex flex-col gap-1 px-4 py-4 flex-1">
                                        {links.map((link, i) => (
                                            <Link key={link.to} to={link.to} onClick={() => setOpen(false)}
                                                style={{ animationDelay: `${i * 50}ms` }}
                                                className="animate-in slide-in-from-right-4 fade-in duration-300">
                                                <Button
                                                    variant={location.pathname === link.to ? 'default' : 'ghost'}
                                                    className="w-full justify-start text-base h-12"
                                                >
                                                    {link.label}
                                                </Button>
                                            </Link>
                                        ))}
                                    </div>

                                    {/* Mobile auth section */}
                                    <div className="border-t border-border px-4 py-4 space-y-2">
                                        {authUser ? (
                                            <>
                                                <Link to="/cliente" onClick={() => setOpen(false)}>
                                                    <Button variant="outline" className="w-full justify-start gap-2 h-11">
                                                        <User className="w-4 h-4" />
                                                        {authUser.full_name || 'Área Pessoal'}
                                                    </Button>
                                                </Link>
                                                {(authUser.role === 'admin' || authUser.role === 'staff') && (
                                                    <Link to="/admin" onClick={() => setOpen(false)}>
                                                        <Button className="w-full h-11">Painel de Gestão</Button>
                                                    </Link>
                                                )}
                                                <Button variant="ghost" className="w-full justify-start gap-2 h-11 text-muted-foreground"
                                                    onClick={() => { setOpen(false); base44.auth.logout('/'); }}>
                                                    <LogOut className="w-4 h-4" /> Terminar Sessão
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Link to="/login" onClick={() => setOpen(false)}>
                                                    <Button className="w-full h-11 gap-2">
                                                        <LogIn className="w-4 h-4" /> Entrar
                                                    </Button>
                                                </Link>
                                                <Link to="/registo" onClick={() => setOpen(false)}>
                                                    <Button variant="outline" className="w-full h-11">Criar Conta</Button>
                                                </Link>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    );
}
