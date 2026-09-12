import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ApiError,
  getCallStatus,
  retryCall,
  uploadCall,
  type CallStatusResponse,
} from '../../lib/api'
import { PhoneIcon } from '../../dashboard/icons'

type Stage = 'form' | 'uploading' | 'processing' | 'completed' | 'failed' | 'error'

const POLL_INTERVAL_MS = 2000
const MAX_POLLS = 45 // ~90s before giving up and telling the agent to check back later

const STATUS_LABEL: Record<string, string> = {
  uploaded: 'Uploaded - starting transcription...',
  transcribed: 'Transcribed - classifying intent...',
  completed: 'Complete',
  failed: 'Failed',
}

function useRecorder() {
  const [recording, setRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [recorderError, setRecorderError] = useState('')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  async function start() {
    setRecorderError('')
    if (!navigator.mediaDevices?.getUserMedia) {
      setRecorderError('Microphone recording is not available in this browser.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      chunksRef.current = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = () => {
        setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }))
        stream.getTracks().forEach((track) => track.stop())
      }
      mediaRecorderRef.current = recorder
      recorder.start()
      setRecording(true)
    } catch {
      setRecorderError('Microphone access was denied or is unavailable.')
    }
  }

  function stop() {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  function reset() {
    setAudioBlob(null)
    setRecorderError('')
  }

  return { recording, audioBlob, recorderError, start, stop, reset, setAudioBlob }
}

export default function UploadCall() {
  const [stage, setStage] = useState<Stage>('form')
  const [callAgentCode, setCallAgentCode] = useState('CA01')
  const [customerName, setCustomerName] = useState('')
  const [customerNumber, setCustomerNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [callStatus, setCallStatus] = useState<CallStatusResponse | null>(null)
  const pollCountRef = useRef(0)

  const recorder = useRecorder()

  function handleFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      recorder.reset()
      recorder.setAudioBlob(file)
    }
  }

  async function pollUntilDone(callId: string) {
    pollCountRef.current = 0
    const poll = async () => {
      pollCountRef.current += 1
      try {
        const status = await getCallStatus(callId)
        setCallStatus(status)
        if (status.status === 'completed') {
          setStage('completed')
          return
        }
        if (status.status === 'failed') {
          setStage('failed')
          return
        }
      } catch {
        // transient poll failure - keep trying until MAX_POLLS
      }
      if (pollCountRef.current >= MAX_POLLS) {
        setStage('processing') // give up polling but leave it visibly "still processing"
        return
      }
      setTimeout(poll, POLL_INTERVAL_MS)
    }
    poll()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!recorder.audioBlob) {
      setErrorMessage('Record or choose an audio file first.')
      return
    }
    setErrorMessage('')
    setStage('uploading')
    try {
      const result = await uploadCall({
        callAgentCode,
        customerName: customerName || undefined,
        customerNumber: customerNumber || undefined,
        file: recorder.audioBlob,
        filename: 'call-recording.webm',
      })
      setStage('processing')
      pollUntilDone(result.call_id)
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.status === 404
            ? `Unknown call agent code "${callAgentCode}".`
            : err.message
          : 'Upload failed - check your connection and try again.'
      setErrorMessage(message)
      setStage('error')
    }
  }

  async function handleRetry() {
    if (!callStatus) return
    const callId = callStatus.call_id
    setStage('processing')
    try {
      await retryCall(callId)
      pollUntilDone(callId)
    } catch (err) {
      setErrorMessage(
        err instanceof ApiError ? err.message : 'Retry failed - check your connection.',
      )
      setStage('error')
    }
  }

  function handleReset() {
    recorder.reset()
    setCallStatus(null)
    setErrorMessage('')
    setStage('form')
  }

  return (
    <div className="bg-line/40 flex min-h-screen justify-center font-sans text-ink sm:px-4 sm:py-10">
      <div className="bg-paper flex w-full max-w-[420px] flex-col sm:h-[812px] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-line sm:shadow-2xl">
        <header className="border-line flex items-center gap-3 border-b bg-white px-4 py-3.5">
          <Link to="/employee" className="text-friday-blue text-sm font-semibold">
            &larr;
          </Link>
          <p className="font-serif text-lg font-semibold text-ink">Log a Call</p>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-5">
          {stage === 'form' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-ink/50 text-[11px] font-semibold tracking-widest uppercase">
                  Call Agent Code
                </label>
                <input
                  value={callAgentCode}
                  onChange={(e) => setCallAgentCode(e.target.value)}
                  required
                  className="border-line mt-1.5 w-full rounded border bg-white px-3 py-2.5 text-sm outline-none focus:border-friday-blue"
                />
              </div>
              <div>
                <label className="text-ink/50 text-[11px] font-semibold tracking-widest uppercase">
                  Customer Name
                </label>
                <input
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Optional"
                  className="border-line mt-1.5 w-full rounded border bg-white px-3 py-2.5 text-sm outline-none placeholder:text-ink/30 focus:border-friday-blue"
                />
              </div>
              <div>
                <label className="text-ink/50 text-[11px] font-semibold tracking-widest uppercase">
                  Customer Number
                </label>
                <input
                  value={customerNumber}
                  onChange={(e) => setCustomerNumber(e.target.value)}
                  placeholder="Optional"
                  className="border-line mt-1.5 w-full rounded border bg-white px-3 py-2.5 text-sm outline-none placeholder:text-ink/30 focus:border-friday-blue"
                />
              </div>

              <div className="border-line rounded-lg border bg-white p-4">
                <p className="text-ink/50 text-[11px] font-semibold tracking-widest uppercase">
                  Recording
                </p>

                {recorder.audioBlob ? (
                  <div className="mt-3 space-y-2">
                    <audio controls src={URL.createObjectURL(recorder.audioBlob)} className="w-full" />
                    <button
                      type="button"
                      onClick={recorder.reset}
                      className="text-friday-blue text-xs font-semibold"
                    >
                      Discard and start over
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-3">
                    <button
                      type="button"
                      onClick={recorder.recording ? recorder.stop : recorder.start}
                      className={`flex items-center justify-center gap-2 rounded px-4 py-3 text-sm font-semibold text-white ${
                        recorder.recording ? 'bg-danger' : 'bg-panel'
                      }`}
                    >
                      <PhoneIcon className="h-4 w-4" />
                      {recorder.recording ? 'Stop Recording' : 'Record Call'}
                    </button>
                    {recorder.recorderError && (
                      <p className="text-danger text-xs">{recorder.recorderError}</p>
                    )}
                    <div className="text-ink/40 flex items-center gap-2 text-xs">
                      <span className="bg-line h-px flex-1" />
                      or
                      <span className="bg-line h-px flex-1" />
                    </div>
                    <label className="border-line text-ink/70 flex cursor-pointer items-center justify-center rounded border px-4 py-3 text-sm font-semibold">
                      Choose Audio File
                      <input type="file" accept="audio/*" onChange={handleFilePicked} className="hidden" />
                    </label>
                  </div>
                )}
              </div>

              {errorMessage && <p className="text-danger text-sm">{errorMessage}</p>}

              <button
                type="submit"
                disabled={!recorder.audioBlob}
                className="bg-friday-blue hover:bg-friday-blue-dark disabled:bg-ink/20 w-full rounded py-3.5 text-sm font-semibold text-white uppercase tracking-widest"
              >
                Upload &amp; Analyze
              </button>
            </form>
          )}

          {stage === 'uploading' && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="border-friday-blue h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-ink/60 text-sm">Uploading recording...</p>
            </div>
          )}

          {stage === 'processing' && (
            <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
              <div className="border-friday-blue h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
              <p className="text-sm font-medium text-ink">
                {STATUS_LABEL[callStatus?.status ?? 'uploaded'] ?? 'Processing...'}
              </p>
              <p className="text-ink/45 text-xs">
                Translator AI and intent classification are running in the background.
              </p>
            </div>
          )}

          {stage === 'completed' && callStatus?.outcome && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="bg-friday-blue-soft rounded-full p-4">
                <span className="text-friday-blue text-2xl">&#10003;</span>
              </div>
              <div>
                <p className="font-serif text-xl font-semibold text-ink capitalize">
                  {callStatus.outcome.status.replace('-', ' ')}
                </p>
                {callStatus.outcome.time && (
                  <p className="text-ink/50 mt-1 text-sm">
                    Follow-up: {new Date(callStatus.outcome.time).toLocaleString()}
                  </p>
                )}
              </div>
              {callStatus.transcript && (
                <p className="text-ink/50 border-line max-w-xs rounded border bg-white p-3 text-left text-xs italic">
                  &ldquo;{callStatus.transcript}&rdquo;
                </p>
              )}
              <button
                onClick={handleReset}
                className="bg-friday-blue rounded px-5 py-2.5 text-sm font-semibold text-white"
              >
                Log Another Call
              </button>
            </div>
          )}

          {stage === 'failed' && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-danger font-serif text-xl font-semibold">Processing failed</p>
              <p className="text-ink/60 text-sm">
                {callStatus?.failed_stage === 'transcription'
                  ? 'The recording could not be transcribed.'
                  : callStatus?.failed_stage === 'classification'
                    ? 'The call was transcribed, but the intent could not be classified.'
                    : 'Something went wrong processing this call.'}
              </p>
              {callStatus?.error_message && (
                <p className="text-ink/45 border-line max-w-xs rounded border bg-white p-3 text-left font-mono text-[11px]">
                  {callStatus.error_message}
                </p>
              )}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={handleRetry}
                  className="bg-friday-blue rounded px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Retry Processing
                </button>
                <p className="text-ink/40 text-xs">
                  Your recording is saved - retrying won&apos;t re-upload it.
                </p>
                <button onClick={handleReset} className="text-ink/50 mt-1 text-xs underline">
                  Log a different call
                </button>
              </div>
            </div>
          )}

          {stage === 'error' && (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-danger font-serif text-xl font-semibold">Upload failed</p>
              <p className="text-ink/50 text-sm">{errorMessage}</p>
              <button
                onClick={() => setStage('form')}
                className="bg-friday-blue rounded px-5 py-2.5 text-sm font-semibold text-white"
              >
                Back
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
