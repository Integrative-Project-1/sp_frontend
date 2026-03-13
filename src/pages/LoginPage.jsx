import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, ArrowRight, Loader2, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const IMG_HERO = '/login-hero.png';

/* ── shared input styles ─────────────────────────────────────────────── */
const inputClass =
  'w-full py-[17px] rounded-[48px] text-white outline-none focus:ring-2 focus:ring-[#24FB8F]/40';
const inputStyle = {
  backgroundColor: 'rgba(1,35,15,0.55)',
  border: '1px solid #14532d',
  fontFamily: "'Lexend', sans-serif",
  fontSize: '16px',
};

/* ── Tab bar ─────────────────────────────────────────────────────────── */
const TabBar = ({ active, onChange }) => (
  <div
    className="flex mb-8 rounded-[48px] p-1"
    style={{ backgroundColor: 'rgba(1,35,15,0.55)', border: '1px solid #14532d' }}
  >
    {['login', 'register'].map((tab) => {
      const label = tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta';
      const isActive = active === tab;
      return (
        <button
          key={tab}
          type="button"
          onClick={() => onChange(tab)}
          className="flex-1 py-[10px] rounded-[40px] transition-all"
          style={{
            fontFamily: "'Lexend', sans-serif",
            fontWeight: isActive ? 700 : 400,
            fontSize: '15px',
            color: isActive ? '#001507' : '#A7D8BF',
            backgroundColor: isActive ? '#24FB8F' : 'transparent',
            boxShadow: isActive
              ? '0px 4px 6px -4px rgba(36,251,143,0.4)'
              : 'none',
          }}
        >
          {label}
        </button>
      );
    })}
  </div>
);

/* ── Login form ──────────────────────────────────────────────────────── */
const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

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
    <>
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

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {/* Usuario */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-username"
            className="text-[#cbd5e1]"
            style={{ fontWeight: 500, fontSize: '14px' }}
          >
            Usuario
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <User size={16} className="text-[#6b7280]" />
            </div>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="tu_usuario"
              className={`${inputClass} pl-[49px] pr-[17px]`}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-password"
            className="text-[#cbd5e1]"
            style={{ fontWeight: 500, fontSize: '14px' }}
          >
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock size={16} className="text-[#6b7280]" />
            </div>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className={`${inputClass} pl-[49px] pr-[49px]`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#24FB8F] transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-[48px] text-red-400 text-sm"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="relative w-full flex items-center justify-center gap-2 py-[16px] rounded-[48px] text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#0F8F4F',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            fontFamily: "'Lexend', sans-serif",
            boxShadow: '0px 10px 15px -3px rgba(15,143,79,0.25), 0px 4px 6px -4px rgba(15,143,79,0.2)',
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
    </>
  );
};

/* ── Register form ───────────────────────────────────────────────────── */
const RegisterForm = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await register({ username, email, password });
      navigate('/hoy');
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta.');
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2
          className="text-[#f1f5f9]"
          style={{ fontWeight: 700, fontSize: '30px', lineHeight: '36px' }}
        >
          Crear cuenta
        </h2>
        <p
          className="mt-2 text-[#94a3b8]"
          style={{ fontWeight: 400, fontSize: '16px', lineHeight: '24px' }}
        >
          Completa tus datos para empezar a planificar tu aprendizaje.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        {/* Usuario */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reg-username"
            className="text-[#cbd5e1]"
            style={{ fontWeight: 500, fontSize: '14px' }}
          >
            Usuario
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <User size={16} className="text-[#6b7280]" />
            </div>
            <input
              id="reg-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              placeholder="tu_usuario"
              className={`${inputClass} pl-[49px] pr-[17px]`}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reg-email"
            className="text-[#cbd5e1]"
            style={{ fontWeight: 500, fontSize: '14px' }}
          >
            Correo electrónico
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail size={16} className="text-[#6b7280]" />
            </div>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="correo@ejemplo.com"
              className={`${inputClass} pl-[49px] pr-[17px]`}
              style={inputStyle}
            />
          </div>
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reg-password"
            className="text-[#cbd5e1]"
            style={{ fontWeight: 500, fontSize: '14px' }}
          >
            Contraseña
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock size={16} className="text-[#6b7280]" />
            </div>
            <input
              id="reg-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className={`${inputClass} pl-[49px] pr-[49px]`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#24FB8F] transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirmar contraseña */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reg-confirm"
            className="text-[#cbd5e1]"
            style={{ fontWeight: 500, fontSize: '14px' }}
          >
            Confirmar contraseña
          </label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock size={16} className="text-[#6b7280]" />
            </div>
            <input
              id="reg-confirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              className={`${inputClass} pl-[49px] pr-[49px]`}
              style={inputStyle}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#24FB8F] transition-colors"
              aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="p-3 rounded-[48px] text-red-400 text-sm"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          aria-busy={loading}
          className="relative w-full flex items-center justify-center gap-2 py-[16px] rounded-[48px] text-white transition-opacity disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: '#0F8F4F',
            fontWeight: 700,
            fontSize: '16px',
            lineHeight: '24px',
            fontFamily: "'Lexend', sans-serif",
            boxShadow: '0px 10px 15px -3px rgba(15,143,79,0.25), 0px 4px 6px -4px rgba(15,143,79,0.2)',
          }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creando cuenta...
            </>
          ) : (
            <>
              Crear cuenta
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>
    </>
  );
};

/* ── Page ────────────────────────────────────────────────────────────── */
const LoginPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('login');

  if (user) return <Navigate to="/hoy" replace />;

  return (
    <div
      className="flex min-h-screen w-full"
      style={{ backgroundColor: '#001507', fontFamily: "'Lexend', sans-serif" }}
    >
      {/* ── Columna izquierda: ilustración ── */}
      <div
        className="relative hidden lg:flex flex-1 items-end overflow-hidden"
        style={{ backgroundColor: 'rgba(15,143,79,0.18)' }}
      >
        <img
          src={IMG_HERO}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, #001507 0%, rgba(0,21,7,0.2) 50%, rgba(0,21,7,0) 100%)',
          }}
        />
        <div className="relative z-10 p-[80px] w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-[38px] h-[32px] bg-[#24FB8F] rounded-lg flex items-center justify-center">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M11 0L22 6V18H15V11H7V18H0V6L11 0Z" fill="#001507" />
              </svg>
            </div>
            <span
              className="text-white"
              style={{ fontWeight: 700, fontSize: '30px', letterSpacing: '-0.75px', lineHeight: '36px' }}
            >
              StudyPlan
            </span>
          </div>
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
          <p
            className="max-w-[512px]"
            style={{ fontWeight: 400, fontSize: '20px', lineHeight: '28px', color: '#C2FFD9' }}
          >
            Únete a una comunidad de estudiantes dedicados y toma el control de tu futuro académico
            con nuestras herramientas avanzadas de planificación.
          </p>
        </div>
      </div>

      {/* ── Columna derecha: formulario ── */}
      <div
        className="flex flex-1 items-center justify-center p-6 lg:p-[96px]"
        style={{ backgroundColor: '#001507' }}
      >
        <div className="w-full" style={{ maxWidth: '448px' }}>

          {/* Logo (solo en móvil) */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-[38px] h-[32px] bg-[#24FB8F] rounded-lg flex items-center justify-center">
              <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
                <path d="M11 0L22 6V18H15V11H7V18H0V6L11 0Z" fill="#001507" />
              </svg>
            </div>
            <span
              className="text-white"
              style={{ fontWeight: 700, fontSize: '24px', letterSpacing: '-0.5px' }}
            >
              StudyPlan
            </span>
          </div>

          <TabBar active={tab} onChange={setTab} />

          {tab === 'login' ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
