type JsonRecord = Record<string, unknown>;

const CAREER_APPLICATION_ENDPOINT = '/api/career-applications';
const CAREER_APPLICATION_UID = 'api::career-application.career-application';
const DEFAULT_CAREER_RESUME_FIELD = 'resume';

export function getStrapiBaseUrl() {
  return (process.env.NEXT_PUBLIC_STRAPI_API_URL || '').replace(/\/$/, '');
}

export function getStrapiToken() {
  return process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || '';
}

function getCareerResumeFieldName() {
  return process.env.STRAPI_CAREER_RESUME_FIELD || DEFAULT_CAREER_RESUME_FIELD;
}

export function assertStrapiConfig() {
  const baseUrl = getStrapiBaseUrl();
  const token = getStrapiToken();

  if (!baseUrl) {
    throw new Error('Missing NEXT_PUBLIC_STRAPI_API_URL.');
  }
  if (!token) {
    throw new Error('Missing NEXT_PUBLIC_STRAPI_API_TOKEN.');
  }
}

export function normalizeOptionalString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function parseApiResponse(response: Response): Promise<{ payload: unknown; rawText: string }> {
  let payload: unknown = null;
  let rawText = '';

  try {
    payload = await response.clone().json();
  } catch {
    try {
      rawText = await response.text();
    } catch {
      rawText = '';
    }
  }

  return { payload, rawText };
}

function getErrorMessage(payload: unknown, rawText: string, fallback: string) {
  const errorPayload =
    typeof payload === 'object' && payload !== null && 'error' in payload
      ? (payload as {
          error?: {
            message?: string;
            details?: unknown;
          };
        }).error
      : null;

  const payloadMessage =
    typeof errorPayload?.message === 'string'
      ? errorPayload.message
      : null;

  const payloadDetails =
    errorPayload?.details && typeof errorPayload.details === 'object'
      ? (() => {
          try {
            return JSON.stringify(errorPayload.details);
          } catch {
            return null;
          }
        })()
      : null;

  return payloadMessage || payloadDetails || rawText || fallback;
}

function getEntityId(payload: unknown): string | number | null {
  if (typeof payload !== 'object' || payload === null || !('data' in payload)) {
    return null;
  }

  const data = (payload as { data?: { id?: string | number; documentId?: string | number } }).data;
  if (!data) return null;

  return data.id ?? data.documentId ?? null;
}

async function attachResumeToCareerApplication(id: string | number, file: File): Promise<void> {
  // Strapi upload endpoint is the canonical way to link a media file to an entry.
  // It does NOT require a `data` payload in the multipart body.
  const formData = new FormData();
  formData.append('files', file, file.name);
  formData.append('ref', CAREER_APPLICATION_UID);
  formData.append('refId', String(id));
  formData.append('field', getCareerResumeFieldName());

  const response = await fetch(`${getStrapiBaseUrl()}/api/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getStrapiToken()}`,
    },
    body: formData,
  });

  const { payload, rawText } = await parseApiResponse(response);

  if (
    !response.ok ||
    (typeof payload === 'object' && payload !== null && 'error' in payload)
  ) {
    console.error(
      `[career-application] Strapi resume attach failed (status ${response.status}).`,
      typeof payload === 'object' && payload !== null ? payload : rawText,
    );
    throw new Error(
      getErrorMessage(payload, rawText, `Failed to attach resume in Strapi (HTTP ${response.status}).`),
    );
  }
}

export async function submitToStrapiCollection(
  endpoint: string,
  data: JsonRecord,
): Promise<{ id: string | number | null }> {
  assertStrapiConfig();

  const response = await fetch(`${getStrapiBaseUrl()}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getStrapiToken()}`,
    },
    body: JSON.stringify({ data }),
  });

  const { payload, rawText } = await parseApiResponse(response);

  if (
    !response.ok ||
    (typeof payload === 'object' && payload !== null && 'error' in payload)
  ) {
    throw new Error(
      getErrorMessage(
        payload,
        rawText,
        `Failed to save record in Strapi (HTTP ${response.status}).`,
      ),
    );
  }

  return { id: getEntityId(payload) };
}

export async function submitCareerApplicationToStrapi(
  data: JsonRecord,
  resumeFile: File | null,
): Promise<{ id: string | number | null }> {
  const payload = { ...data };

  const saved = await submitToStrapiCollection(CAREER_APPLICATION_ENDPOINT, payload);

  if (!resumeFile || saved.id === null) {
    return saved;
  }

  // Resume is optional; do not fail the entire submission if upload/linking fails.
  try {
    await attachResumeToCareerApplication(saved.id, resumeFile);
  } catch (err) {
    console.warn(
      '[career-application] Resume upload/link failed; application saved without resume.',
      err instanceof Error ? err.message : String(err),
    );
  }

  return saved;
}

export {};

