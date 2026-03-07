import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IMG_HERO = '/login-hero.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  if (user) return <Navigate to="/hoy" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await login({ username, password });
      navigate('/hoy');
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div
      className="flex min-h-screen w-full"
      style={{ backgroundColor: '#101a22', fontFamily: "'Lexend', sans-serif" }}
    >
      {/* ── Columna izquierda: ilustración ── */}
      <div className="relative hidden lg:flex flex-1 items-end overflow-hidden"
        style={{ backgroundColor: 'rgba(43,157,238,0.1)' }}>

        {/* Foto de fondo */}
        <img
          src={IMG_HERO}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />

        {/* Gradiente inferior */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, #101a22 0%, rgba(16,26,34,0.2) 50%, rgba(16,26,34,0) 100%)',
          }}
        />

        {/* Contenido inferior */}
        <div className="relative z-10 p-[80px] w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[38px] h-[32px] bg-[#2b9dee] rounded-lg flex items-center justify-center">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M11 0L22 6V18H15V11H7V18H0V6L11 0Z" fill="white" />
              </svg>
            </div>
            <span
              className="text-white"
              style={{ fontWeight: 700, fontSize: '30px', letterSpacing: '-0.75px', lineHeight: '36px' }}
            >
              StudyPlan
            </span>
          </div>

          {/* Heading principal */}
          <div className="mb-4">
            <h1
              className="text-white"
              style={{ fontWeight: 700, fontSize: '48px', lineHeight: '60px' }}
            >
              Domina tu
              <br />
              Trayectoria de Aprendizaje
            </h1>
          </div>

          {/* Subtítulo */}
          <p
            className="max-w-[512px]"
            style={{ fontWeight: 400, fontSize: '20px', lineHeight: '28px', color: '#cbd5e1' }}
          >
            Únete a una comunidad de estudiantes dedicados y toma el control de tu futuro académico con nuestras herramientas avanzadas de planificación.
          </p>
        </div>
      </div>

      {/* ── Columna derecha: formulario ── */}
      <div
        className="flex flex-1 items-center justify-center p-6 lg:p-[96px]"
        style={{ backgroundColor: '#101a22' }}
      >
        <div className="w-full" style={{ maxWidth: '448px' }}>

          {/* Logo (solo en móvil) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-[38px] h-[32px] bg-[#2b9dee] rounded-lg flex items-center justify-center">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M11 0L22 6V18H15V11H7V18H0V6L11 0Z" fill="white" />
              </svg>
            </div>
            <span
              className="text-white"
              style={{ fontWeight: 700, fontSize: '24px', letterSpacing: '-0.5px' }}
            >
              StudyPlan
            </span>
          </div>

          {/* Encabezado */}
          <div className="mb-8">
            <h2
              className="text-[#f1f5f9]"
              style={{ fontWeight: 700, fontSize: '30px', lineHeight: '36px' }}
            >
              Bienvenido de nuevo
            </h2>
            <p
              className="mt-2 text-[#94a3b8]"
              style={{ fontWeight: 400, fontSize: '16px', lineHeight: '24px' }}
            >
              Por favor ingresa tus datos para acceder a tu panel.
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>

            {/* Correo */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="username"
                className="text-[#cbd5e1]"
                style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <User size={16} className="text-[#6b7280]" />
                </div>
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  placeholder="tu_usuario"
                  className="w-full pl-[49px] pr-[17px] py-[17px] rounded-[48px] text-white outline-none focus:ring-2 focus:ring-[#2b9dee]/50"
                  style={{
                    backgroundColor: 'rgba(30,41,59,0.5)',
                    border: '1px solid #334155',
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: '16px',
                    color: username ? '#f1f5f9' : undefined,
                  }}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[#cbd5e1]"
                  style={{ fontWeight: 500, fontSize: '14px', lineHeight: '20px' }}
                >
                  Contraseña
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock size={16} className="text-[#6b7280]" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full pl-[49px] pr-[49px] py-[17px] rounded-[48px] text-white outline-none focus:ring-2 focus:ring-[#2b9dee]/50"
                  style={{
                    backgroundColor: 'rgba(30,41,59,0.5)',
                    border: '1px solid #334155',
                    fontFamily: "'Lexend', sans-serif",
                    fontSize: '16px',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#94a3b8] transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="p-3 rounded-[48px] text-red-400 text-sm"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
              >
                {error}
              </div>
            )}

            {/* Botón Iniciar sesión */}
            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="relative w-full flex items-center justify-center gap-2 py-[16px] rounded-[48px] text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#2b9dee',
                fontWeight: 700,
                fontSize: '16px',
                lineHeight: '24px',
                fontFamily: "'Lexend', sans-serif",
                boxShadow: '0px 10px 15px -3px rgba(43,157,238,0.2), 0px 4px 6px -4px rgba(43,157,238,0.2)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Hint credenciales demo */}

          {/* Legal */}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
