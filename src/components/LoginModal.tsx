import React, { useState } from 'react';
import { X, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { AuthUser } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (correo: string, password: string) => Promise<AuthUser>;
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await onLogin(correo.trim(), password);
      setCorreo('');
      setPassword('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No fue posible iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-[#2D2926]/60 backdrop-blur-md transition-opacity duration-300"
        onClick={loading ? undefined : onClose}
      />

      <div className="relative bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-natural-border p-6 sm:p-8 z-10 animate-scale-in">
        <div className="flex justify-between items-start mb-6 border-b border-natural-border pb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-serif font-bold text-natural-dark">Acceso Administrativo</h3>
            <p className="text-xs text-natural-muted">Ingrese con el usuario creado en el backend.</p>
          </div>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-full text-natural-tag hover:text-natural-dark hover:bg-natural-light-gray transition cursor-pointer disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono block">
              Correo electrónico
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-natural-tag pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                type="email"
                required
                value={correo}
                onChange={(e) => {
                  setCorreo(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="admin@didactica.com"
                className="w-full bg-white border border-natural-border hover:border-natural-tag/60 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-natural-text placeholder:text-natural-tag focus:outline-none focus:ring-1 focus:ring-sage focus:border-sage transition"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-natural-tag uppercase tracking-wider font-mono block">
              Contraseña
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-natural-tag pointer-events-none">
                <Lock className="w-4 h-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="••••••••"
                className="w-full bg-white border border-natural-border hover:border-natural-tag/60 rounded-xl py-3 pl-10 pr-4 text-xs font-sans text-natural-text placeholder:text-natural-tag focus:outline-none focus:ring-1 focus:ring-sage focus:border-sage transition"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-terracotta-light border border-terracotta/20 text-terracotta text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 bg-sage hover:bg-[#4D5E43] text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-sage/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>Iniciar Sesión</span>
          </button>
        </form>
      </div>
    </div>
  );
}
