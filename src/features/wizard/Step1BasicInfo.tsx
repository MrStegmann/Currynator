import React, { useState } from 'react';
import { Mail, User } from 'lucide-react';

interface Step1Props {
  data: { firstName: string; lastName: string; email: string };
  updateData: (data: Partial<{ firstName: string; lastName: string; email: string }>) => void;
  onNext: () => void;
}

export default function Step1BasicInfo({ data, updateData, onNext }: Step1Props) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');

  const handleGoogleConnect = async () => {
    setIsGoogleLoading(true);
    setGoogleError('');
    try {
      const result = await (window as any).electronAPI.googleOAuth();
      if (result.success) {
        updateData({
          firstName: result.data.firstName || data.firstName,
          lastName: result.data.lastName || data.lastName,
          email: result.data.email || data.email
        });
        onNext();
      } else {
        setGoogleError(result.error || 'Falló la conexión con Google');
      }
    } catch (e: any) {
      setGoogleError(e.message || 'Error inesperado');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isFormValid = data.firstName.trim() !== '' && data.lastName.trim() !== '' && data.email.trim() !== '';

  return (
    <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
      <div className="space-y-2 text-center mb-4">
        <h2 className="text-headline-md text-on-surface">Bienvenido a Currynator</h2>
        <p className="text-body-md text-on-surface-variant">
          Vamos a configurar tu entorno. Puedes rellenar tus datos manualmente o conectar con Google.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={handleGoogleConnect}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-md bg-white text-gray-900 font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {isGoogleLoading ? 'Conectando...' : 'Conectar con Google'}
        </button>
        {googleError && <p className="text-status-error text-sm text-center">{googleError}</p>}

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-outline-variant"></div>
          <span className="flex-shrink-0 mx-4 text-on-surface-variant text-sm">O manualmente</span>
          <div className="flex-grow border-t border-outline-variant"></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 relative">
            <label className="text-label-caps text-on-surface-variant">Nombre</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={data.firstName}
                onChange={e => updateData({ firstName: e.target.value })}
                className="w-full bg-surface-deep border border-outline-variant rounded px-10 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Ej. Ada"
              />
            </div>
          </div>
          <div className="space-y-1 relative">
            <label className="text-label-caps text-on-surface-variant">Apellidos</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="text"
                value={data.lastName}
                onChange={e => updateData({ lastName: e.target.value })}
                className="w-full bg-surface-deep border border-outline-variant rounded px-10 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Ej. Lovelace"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1 relative">
          <label className="text-label-caps text-on-surface-variant">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              type="email"
              value={data.email}
              onChange={e => updateData({ email: e.target.value })}
              className="w-full bg-surface-deep border border-outline-variant rounded px-10 py-2 text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="ada@example.com"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={onNext}
          disabled={!isFormValid}
          className="bg-primary text-on-primary px-6 py-2 rounded font-medium hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
