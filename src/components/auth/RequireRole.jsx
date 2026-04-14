import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Shield, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { useAuth } from '@/lib/AuthContext';

export default function RequireRole({ roles = [], children }) {
  const { user, isLoadingAuth, isAuthenticated } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-space font-bold mb-2">Acesso Restrito</h2>
          <p className="text-muted-foreground mb-6">Precisa de iniciar sessão para aceder a esta área.</p>
          <Button onClick={() => base44.auth.redirectToLogin(window.location.href)} className="gap-2 w-full">
            <LogIn className="w-4 h-4" /> Iniciar Sessão
          </Button>
        </div>
      </div>
    );
  }

  const isAllowed = roles.length === 0 || roles.includes(user?.role);

  if (!isAllowed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-space font-bold mb-2">Sem Permissão</h2>
          <p className="text-muted-foreground mb-6">
            A sua conta ({user?.role}) não tem acesso a esta área.
          </p>
          <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return children;
}