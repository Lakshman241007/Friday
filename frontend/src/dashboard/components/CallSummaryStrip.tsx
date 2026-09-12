import type { CallDetail } from '../callDetailData'

export function CallSummaryStrip({ detail }: { detail: CallDetail }) {
  const sentimentTone =
    detail.sentimentLabel === 'Positive'
      ? 'text-friday-orange'
      : detail.sentimentLabel === 'Negative'
        ? 'text-danger'
        : 'text-ink'

  const items = [
    { label: 'Duration', value: detail.duration, className: 'text-ink' },
    { label: 'Employee', value: detail.employee, className: 'text-ink' },
    { label: 'Lead', value: detail.leadName, className: 'text-ink' },
    { label: 'AI Score', value: `${detail.aiScore} /100`, className: 'text-ink' },
    { label: 'Sentiment', value: detail.sentimentLabel, className: sentimentTone },
    { label: 'Outcome', value: detail.outcome, className: 'text-ink' },
  ]

  return (
    <div className="border-friday-blue bg-paper grid grid-cols-2 gap-6 rounded-r-lg border-l-4 px-6 py-5 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <div key={item.label}>
          <p className="text-ink/40 text-[10px] font-semibold tracking-widest uppercase">
            {item.label}
          </p>
          <p className={`font-serif mt-1 text-base font-medium ${item.className}`}>
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
