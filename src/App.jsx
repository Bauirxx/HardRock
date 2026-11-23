import { Suspense, lazy } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Eager-loaded: landing + login (first paint)
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';

// Lazy-loaded: everything else (code-split)
const HardRockPage = lazy(() => import('./pages/HardRockPage'));
const GinasioInscricaoPage = lazy(() => import('./pages/GinasioInscricaoPage'));
const StorePage = lazy(() => import('./pages/StorePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const PaymentReturnPage = lazy(() => import('./pages/PaymentReturnPage'));
const TrackingPage = lazy(() => import('./pages/TrackingPage'));
const EquipmentPage = lazy(() => import('./pages/EquipmentPage'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard'));

// Admin — heavy bundle, split separately
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminClients = lazy(() => import('./pages/admin/AdminClients'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminLeads = lazy(() => import('./pages/admin/AdminLeads'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminTestimonials = lazy(() => import('./pages/admin/AdminTestimonials'));
const AdminTransformations = lazy(() => import('./pages/admin/AdminTransformations'));
const AdminInscricoes = lazy(() => import('./pages/admin/AdminInscricoes'));
const AdminTrainers = lazy(() => import('./pages/admin/AdminTrainers'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminSubscriptions = lazy(() => import('./pages/admin/AdminSubscriptions'));

function RouteSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-sm text-muted-foreground animate-pulse">A carregar...</p>
      </div>
    </div>
  );
}

// Guarda de rota: bloqueia páginas privadas sem sessão válida.
// Loja e landing são públicas e não usam este guarda.
function RequireAuth({ children, allowedRoles }) {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const hasToken = !!localStorage.getItem('auth_token');

  if (isLoadingAuth) return <RouteSpinner />;

  // Sem token ou sessão inválida/expirada → obrigar login (mesmo se em cache)
  if (!isAuthenticated || !hasToken) {
    const returnUrl = encodeURIComponent(window.location.pathname);
    return <Navigate to={`/login?return_url=${returnUrl}`} replace />;
  }

  // Autenticado mas sem o papel exigido → mandar para a página inicial
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const AuthenticatedApp = () => {
  const { user, isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      if (window.location.pathname !== '/login') {
        navigateToLogin();
        return null;
      }
    }
  }

  const isStaff = user?.role === 'staff' || user?.role === 'admin';
  const isTrainer = user?.role === 'personal_trainer';

  const ClientEntry = isStaff
    ? <Navigate to="/admin" replace />
    : isTrainer
    ? <Navigate to="/trainer" replace />
    : <ClientDashboard />;

  return (
    <Suspense fallback={<RouteSpinner />}>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/ginasio" element={<HardRockPage />} />
        <Route path="/ginasio/inscricao" element={<GinasioInscricaoPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registo" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/loja" element={<StorePage />} />
        <Route path="/produto/:id" element={<ProductDetailPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pagamento/retorno" element={<PaymentReturnPage />} />
        <Route path="/rastreio" element={<TrackingPage />} />
        <Route path="/equipamentos" element={<EquipmentPage />} />

        {/* Account/Member pages — exigem sessão */}
        <Route path="/cliente" element={<RequireAuth>{ClientEntry}</RequireAuth>} />

        {/* Trainer page — exige sessão de trainer/staff */}
        <Route path="/trainer" element={
          <RequireAuth allowedRoles={['personal_trainer', 'admin', 'staff']}>
            <TrainerDashboard />
          </RequireAuth>
        } />

        {/* Admin pages — exigem sessão de admin/staff */}
        <Route path="/admin" element={
          <RequireAuth allowedRoles={['admin', 'staff']}>
            <AdminLayout />
          </RequireAuth>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="clientes" element={<AdminClients />} />
          <Route path="produtos" element={<AdminProducts />} />
          <Route path="encomendas" element={<AdminOrders />} />
          <Route path="pagamentos" element={<AdminPayments />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="servicos" element={<AdminServices />} />
          <Route path="depoimentos" element={<AdminTestimonials />} />
          <Route path="transformacoes" element={<AdminTransformations />} />
          <Route path="inscricoes" element={<AdminInscricoes />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="subscricoes" element={<AdminSubscriptions />} />
          <Route path="configuracoes" element={<AdminSettings />} />
        </Route>

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Suspense>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
