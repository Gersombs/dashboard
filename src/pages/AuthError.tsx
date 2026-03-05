import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

export default function AuthErrorPage() {
  const [searchParams] = useSearchParams();
  const [countdown, setCountdown] = useState(3);
  const errorMessage =
    searchParams.get('msg') ||
    'Lo sentimos, tu informacion de autenticacion es invalida o ha expirado.';

  useEffect(() => {
    // Logica del contador.
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirigir al inicio.
          window.location.href = '/';
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Limpiar el timer.
    return () => clearInterval(timer);
  }, []);

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 p-6 text-center">
      <div className="space-y-6 max-w-md">
        <div className="space-y-4">
          {/* Icono de error */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
              <AlertCircle
                className="relative h-12 w-12 text-red-500"
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Titulo de error */}
          <h1 className="text-2xl font-bold text-gray-800">
            Error de autenticacion
          </h1>

          {/* Descripcion de error */}
          <p className="text-base text-muted-foreground">{errorMessage}</p>

          {/* Cuenta regresiva */}
          <div className="pt-2">
            <p className="text-sm text-gray-500">
              {countdown > 0 ? (
                <>
                  Volveras automaticamente al inicio en{' '}
                  <span className="text-blue-600 font-semibold text-base">
                    {countdown}
                  </span>{' '}
                  segundos
                </>
              ) : (
                'Redirigiendo...'
              )}
            </p>
          </div>
        </div>

        {/* Boton para volver al inicio */}
        <div className="flex justify-center pt-2">
          <Button onClick={handleReturnHome} className="px-6">
            Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
