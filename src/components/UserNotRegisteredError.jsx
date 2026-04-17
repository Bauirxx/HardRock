import React from 'react';
import { UserX, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";

const UserNotRegisteredError = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <UserX className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Utilizador não Registado</h1>
        <p className="text-slate-600 mb-8">
          Não encontrámos o seu registo para esta aplicação. Por favor, contacte a administração do ginásio ou verifique as suas credenciais.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-xl transition-all"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
          
          <p className="text-sm text-slate-400 mt-4">
            Se acredita que isto é um erro, tente limpar o cache do navegador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserNotRegisteredError;
