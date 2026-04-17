import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
<<<<<<< HEAD
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
=======
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

// Page imports
import LandingPage from './pages/LandingPage';
import StorePage from './pages/StorePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import TrackingPage from './pages/TrackingPage';
import EquipmentPage from './pages/EquipmentPage';
import ClientDashboard from './pages/ClientDashboard';
import LoginPage from './pages/LoginPage';
<<<<<<< HEAD
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
=======
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

// Admin imports
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClients from './pages/admin/AdminClients';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminLeads from './pages/admin/AdminLeads';
import AdminServices from './pages/admin/AdminServices';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminSettings from './pages/admin/AdminSettings';
import TrainerDashboard from './pages/TrainerDashboard';

const AuthenticatedApp = () => {
  const { user, isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically if not already there
      if (window.location.pathname !== '/login') {
        navigateToLogin();
        return null;
      }
    }
  }

<<<<<<< HEAD
  // Role gates
  const isStaff = user?.role === 'staff' || user?.role === 'admin';

  // Admins/staff landing on /cliente are redirected to /admin (cleaner UX)
  const ClientEntry = isStaff ? <Navigate to="/admin" replace /> : <ClientDashboard />;
=======
  // Render the main app
  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || user?.role === 'admin';
  const isInternal = user?.role === 'internal_client' || user?.role === 'admin';
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3

  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
<<<<<<< HEAD
      <Route path="/registo" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
=======
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
      <Route path="/loja" element={<StorePage />} />
      <Route path="/produto/:id" element={<ProductDetailPage />} />
      <Route path="/carrinho" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/rastreio" element={<TrackingPage />} />
      <Route path="/equipamentos" element={<EquipmentPage />} />
<<<<<<< HEAD

      {/* Account/Member pages */}
      <Route path="/cliente" element={ClientEntry} />

      {/* Trainer/Staff specifics */}
      <Route path="/trainer" element={isStaff ? <TrainerDashboard /> : <Navigate to="/" replace />} />

      {/* Admin pages */}
      <Route path="/admin" element={isStaff ? <AdminLayout /> : <Navigate to="/" replace />}>
=======
      
      {/* Account/Member pages */}
      <Route path="/cliente" element={<ClientDashboard />} />
      
      {/* Trainer/Staff specifics */}
      <Route path="/trainer" element={isStaff ? <TrainerDashboard /> : <LandingPage />} />

      {/* Admin pages */}
      <Route path="/admin" element={isStaff ? <AdminLayout /> : <LandingPage />}>
>>>>>>> 178c6066442bcf30bce830b8deda6700021cb4a3
        <Route index element={<AdminDashboard />} />
        <Route path="clientes" element={<AdminClients />} />
        <Route path="produtos" element={<AdminProducts />} />
        <Route path="encomendas" element={<AdminOrders />} />
        <Route path="pagamentos" element={<AdminPayments />} />
        <Route path="leads" element={<AdminLeads />} />
        <Route path="servicos" element={<AdminServices />} />
        <Route path="depoimentos" element={<AdminTestimonials />} />
        <Route path="trainers" element={<AdminTrainers />} />
        <Route path="configuracoes" element={<AdminSettings />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
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