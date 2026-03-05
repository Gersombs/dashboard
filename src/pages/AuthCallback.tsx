import { useEffect } from 'react';

export default function AuthCallback() {
  useEffect(() => {
    // Redirigir al inicio despues del callback de autenticacion.
    window.location.href = '/';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1117]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-slate-400">Procesando autenticacion...</p>
      </div>
    </div>
  );
}
