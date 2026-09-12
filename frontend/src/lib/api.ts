// Real backend integration (app/api/routes/calls.py). API_BASE is empty by
// default so requests go to a relative "/api/..." path - in dev that's
// proxied to the FastAPI server by vite.config.ts, and in production it
// assumes the frontend is served from the same origin as the API unless
// VITE_API_BASE_URL overrides it.
const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ''

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

export interface CallUploadResponse {
  call_id: string
  recording_id: string
  storage_path: string
}

export interface CallAgentOutput {
  status: 'success' | 'reject' | 'follow-up'
  time: string | null
}

export interface CallStatusResponse {
  call_id: string
  status: string
  transcript: string | null
  outcome: CallAgentOutput | null
  failed_stage: string | null
  error_message: string | null
}

export interface UploadCallParams {
  callAgentCode: string
  customerName?: string
  customerNumber?: string
  file: Blob
  filename: string
}

async function parseErrorDetail(response: Response): Promise<string> {
  try {
    const body = await response.json()
    return typeof body.detail === 'string' ? body.detail : JSON.stringify(body)
  } catch {
    return response.statusText || `Request failed (${response.status})`
  }
}

export async function uploadCall(params: UploadCallParams): Promise<CallUploadResponse> {
  const formData = new FormData()
  formData.append('call_agent_code', params.callAgentCode)
  if (params.customerName) formData.append('customer_name', params.customerName)
  if (params.customerNumber) formData.append('customer_number', params.customerNumber)
  formData.append('file', params.file, params.filename)

  const response = await fetch(`${API_BASE}/api/calls/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response))
  }
  return response.json()
}

export async function getCallStatus(callId: string): Promise<CallStatusResponse> {
  const response = await fetch(`${API_BASE}/api/calls/${callId}`)
  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response))
  }
  return response.json()
}

/** Re-run the pipeline for a call that failed or stalled. The backend resumes
 *  from whatever it already has, so the recording is never re-uploaded. */
export async function retryCall(callId: string): Promise<CallStatusResponse> {
  const response = await fetch(`${API_BASE}/api/calls/${callId}/retry`, { method: 'POST' })
  if (!response.ok) {
    throw new ApiError(response.status, await parseErrorDetail(response))
  }
  return response.json()
}
