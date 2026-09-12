import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkDemoCredentials, startManagerSession } from '../lib/auth'

function WaveDiagram() {
  return (
    <svg viewBox="0 0 320 90" className="w-full max-w-xs text-white/70">
      <path
        d="M0 55 C 40 55, 40 20, 80 20 S 120 70, 160 70 S 200 30, 240 30 S 280 55, 320 55"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      {[
        { x: 80, y: 20, label: 'VOICE' },
        { x: 160, y: 70, label: 'AI' },
        { x: 240, y: 30, label: 'INTENT' },
      ].map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="4" className="fill-friday-orange" />
          <text
            x={p.x}
            y={p.y - 12}
            textAnchor="middle"
            className="fill-white/80 font-mono text-[9px] tracking-widest uppercase"
          >
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink/40" fill="none" stroke="currentColor">
      <rect x="2.5" y="4.5" width="15" height="11" rx="1.5" strokeWidth="1.3" />
      <path d="M3 5.5 10 11 17 5.5" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function KeyIcon() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink/40" fill="none" stroke="currentColor">
      <circle cx="7" cy="13" r="3.2" strokeWidth="1.3" />
      <path d="M9.3 10.7 16 4M13.2 7.8 15.5 10M15.6 5.6 17.8 7.8" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-ink/40" fill="none" stroke="currentColor">
      <path
        d="M2 10s2.8-5.5 8-5.5S18 10 18 10s-2.8 5.5-8 5.5S2 10 2 10Z"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.2" strokeWidth="1.3" />
      {off && <path d="M3 17 17 3" strokeWidth="1.3" strokeLinecap="round" />}
    </svg>
  )
}

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (checkDemoCredentials(email, password)) {
      startManagerSession()
      navigate('/dashboard')
      return
    }
    setError('Invalid email or password.')
  }

  return (
    <div className="grid min-h-screen font-mono text-ink md:grid-cols-2">
      <div className="bg-friday-blue flex flex-col justify-between p-8 text-white sm:p-12">
        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-semibold tracking-widest uppercase">Friday_Sys</p>
            <p className="text-[10px] tracking-widest text-white/50 uppercase">Auth_Portal_v2.4</p>
          </div>
          <div className="mt-3 h-px w-14 bg-white/30" />
        </div>

        <div className="py-10">
          <h1 className="font-sans text-4xl leading-[0.98] font-black tracking-tight uppercase sm:text-5xl">
            Enter the
            <br />
            intelligence
            <br />
            system.
          </h1>
          <div className="bg-friday-orange mt-6 h-1 w-16" />
          <p className="mt-6 max-w-xs text-sm text-white/70">
            Analyze conversations. Understand intent. Turn every call into action.
          </p>
          <div className="mt-12">
            <WaveDiagram />
          </div>
        </div>

        <div>
          <div className="mb-4 h-px w-full bg-white/15" />
          <p className="flex items-center gap-2 text-[10px] tracking-widest text-white/50 uppercase">
            <span className="bg-friday-orange h-1.5 w-1.5 rounded-full" />
            Secure Authentication
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center bg-paper p-8 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-6 border-b border-line text-sm tracking-widest uppercase">
            <span className="text-friday-blue border-friday-blue -mb-px border-b-2 pb-3 font-semibold">
              Log In
            </span>
            <span className="cursor-not-allowed pb-3 text-ink/30">Sign Up</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-[11px] font-semibold tracking-widest text-ink/50 uppercase"
              >
                Work Email
              </label>
              <div className="mt-2 flex items-center gap-2 border-b border-line pb-2 focus-within:border-friday-blue">
                <MailIcon />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/30"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-[11px] font-semibold tracking-widest text-ink/50 uppercase"
                >
                  Password
                </label>
                <span className="text-friday-blue cursor-pointer text-xs">Forgot?</span>
              </div>
              <div className="mt-2 flex items-center gap-2 border-b border-line pb-2 focus-within:border-friday-blue">
                <KeyIcon />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-friday-orange">{error}</p>}

            <label className="flex items-center gap-2 text-xs text-ink/60">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="accent-friday-blue h-3.5 w-3.5"
              />
              Remember this device
            </label>

            <button
              type="submit"
              className="bg-friday-blue hover:bg-friday-blue-dark flex w-full items-center justify-center gap-2 py-3.5 text-sm font-semibold tracking-widest text-white uppercase transition-colors"
            >
              Continue as Manager
              <span aria-hidden>→</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
