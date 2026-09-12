import { FlagRequestIcon } from '../icons'
import type { CallDetail } from '../callDetailData'

export function ConversationAnalysisCard({ detail }: { detail: CallDetail }) {
  return (
    <div>
      <h2 className="font-serif text-base font-semibold text-ink">Conversation Analysis</h2>

      <div className="mt-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-ink/50">Talk Time</span>
          <span className="text-ink/60 font-medium">
            {detail.talkTime.emp}% EMP&nbsp;&nbsp;{detail.talkTime.cust}% CUST
          </span>
        </div>
        <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-line">
          <div className="bg-friday-blue h-full" style={{ width: `${detail.talkTime.emp}%` }} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="border-line rounded border bg-white p-3 text-center">
          <p className="font-serif text-xl font-semibold text-ink">{detail.questions}</p>
          <p className="text-ink/45 text-[10px] font-semibold tracking-widest uppercase">
            Questions
          </p>
        </div>
        <div className="border-danger/20 bg-danger-soft/40 rounded border p-3 text-center">
          <p className="font-serif text-danger text-xl font-semibold">{detail.objections}</p>
          <p className="text-danger/70 text-[10px] font-semibold tracking-widest uppercase">
            Objections
          </p>
        </div>
        <div className="border-friday-blue/20 bg-friday-blue-soft rounded border p-3 text-center">
          <p className="font-serif text-friday-blue-dark text-xl font-semibold">
            {detail.signalsCount}
          </p>
          <p className="text-friday-blue-dark/70 text-[10px] font-semibold tracking-widest uppercase">
            Signals
          </p>
        </div>
      </div>

      {detail.followUpRequired && (
        <div className="mt-5">
          <p className="text-friday-blue flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase">
            <FlagRequestIcon className="h-3.5 w-3.5" />
            Follow-up Required
          </p>
          <button className="bg-friday-blue hover:bg-friday-blue-dark mt-2 flex w-full items-center justify-center gap-2 rounded py-3 text-xs font-semibold tracking-widest text-white uppercase">
            Create Follow-up
            <span aria-hidden>→</span>
          </button>
        </div>
      )}
    </div>
  )
}
