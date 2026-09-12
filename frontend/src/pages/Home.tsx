import { Link } from 'react-router-dom'

const STEPS = ['Voice', 'Transcript', 'Analysis', 'Intent', 'Outcome']

function SignalRow({
  leftLabel,
  leftSub,
  rightLabel,
  rightSub,
  offset = false,
}: {
  leftLabel: string
  leftSub: string
  rightLabel: string
  rightSub: string
  offset?: boolean
}) {
  return (
    <div className={`flex items-center gap-6 ${offset ? 'ml-8 sm:ml-16' : ''}`}>
      <div>
        <p className="text-xs font-semibold tracking-widest text-ink uppercase">{leftLabel}</p>
        <p className="text-[11px] text-ink/45">{leftSub}</p>
      </div>
      <div className="relative h-px w-16 flex-1 max-w-40 bg-line sm:max-w-56">
        <span className="absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 bg-friday-orange" />
      </div>
      <div>
        <p className="text-xs font-semibold tracking-widest text-friday-blue uppercase">
          {rightLabel}
        </p>
        <p className="text-[11px] text-ink/45">{rightSub}</p>
      </div>
    </div>
  )
}

function PanelOne() {
  return (
    <div className="border border-line bg-white/70 p-5">
      <div className="flex items-center justify-between text-xs font-semibold tracking-widest uppercase">
        <span>Panel 01</span>
        <span className="flex items-center gap-1.5 text-friday-orange">
          <span className="h-1.5 w-1.5 rounded-full bg-friday-orange" />
          Live
        </span>
      </div>
      <dl className="mt-5 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <dt className="tracking-widest text-ink/45 uppercase">Signal</dt>
          <dd className="font-semibold">Stable // 01</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="tracking-widest text-ink/45 uppercase">Voice Processing</dt>
          <dd className="font-semibold">Active</dd>
        </div>
      </dl>
      <div className="relative mt-4 h-px w-full bg-line">
        <span className="absolute top-1/2 right-6 h-2.5 w-2.5 -translate-y-1/2 bg-friday-blue" />
      </div>
    </div>
  )
}

function PanelTwo() {
  return (
    <div className="border border-line bg-white/70 p-5">
      <div className="flex items-center justify-between text-xs font-semibold tracking-widest uppercase">
        <span>Panel 02</span>
        <span className="text-ink/45">Processing Node</span>
      </div>
      <dl className="mt-5 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <dt className="tracking-widest text-ink/45 uppercase">AI Engine</dt>
          <dd className="font-semibold">V 4.2</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="tracking-widest text-ink/45 uppercase">Intent</dt>
          <dd className="font-semibold text-friday-blue">Identified</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="tracking-widest text-ink/45 uppercase">Sentiment</dt>
          <dd className="font-semibold text-friday-orange">Positive (+0.8)</dd>
        </div>
      </dl>
    </div>
  )
}

export default function Home() {
  return (
    <div className="bg-grid-paper min-h-screen font-mono text-ink">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-6 py-12 sm:px-10">
        <header>
          <h1 className="font-sans text-4xl leading-[0.95] font-black tracking-tight uppercase sm:text-6xl">
            Turn every call
            <br />/<br />
            into intelligence.
          </h1>
          <div className="mt-6 h-px w-10 bg-friday-orange" />
        </header>

        <div className="flex flex-1 flex-col justify-center gap-14 py-20">
          <SignalRow
            leftLabel="Voice Input"
            leftSub="Mic // 44.1kHz"
            rightLabel="AI Analysis"
            rightSub="Model // NLP-X"
          />
          <SignalRow
            leftLabel="Real-Time Signal"
            leftSub="Latency < 12ms"
            rightLabel="Intent Detection"
            rightSub="Confidence > 94%"
            offset
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PanelOne />
          <PanelTwo />
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/login"
            className="bg-friday-blue hover:bg-friday-blue-dark inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold tracking-widest text-white uppercase transition-colors"
          >
            <span className="h-2 w-2 bg-friday-orange" />
            Enter Friday
          </Link>
        </div>

        <footer className="mt-10 flex flex-wrap items-center gap-2 text-[11px] tracking-widest text-ink/45 uppercase">
          {STEPS.map((step, i) => (
            <span key={step} className="flex items-center gap-2">
              <span className={step === 'Intent' ? 'text-friday-orange' : ''}>{step}</span>
              {i < STEPS.length - 1 && <span>→</span>}
            </span>
          ))}
        </footer>
      </div>
    </div>
  )
}
