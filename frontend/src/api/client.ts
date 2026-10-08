const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

type RequestOptions = {
  body?: BodyInit
  headers?: HeadersInit
  method?: string
  searchParams?: Record<string, string | number | boolean>
}

function buildUrl(
  path: string,
  searchParams?: RequestOptions['searchParams'],
): string {
  const url = new URL(path, API_BASE_URL)

  if (searchParams) {
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, String(value))
    })
  }

  return url.toString()
}

async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed with status ${response.status}`
  try {
    const body: unknown = await response.json()
    return typeof body === 'object' &&
      body !== null &&
      'detail' in body &&
      typeof body.detail === 'string'
      ? body.detail
      : fallback
  } catch {
    return fallback
  }
}

async function request<TResponse>(
  path: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { body, headers, method = 'GET', searchParams } = options

  const response = await fetch(buildUrl(path, searchParams), {
    body,
    headers,
    method,
  })

  if (!response.ok) {
    throw new Error(await readErrorMessage(response))
  }

  return response.json() as Promise<TResponse>
}

export function get<TResponse>(
  path: string,
  searchParams?: RequestOptions['searchParams'],
): Promise<TResponse> {
  return request<TResponse>(path, {
    method: 'GET',
    searchParams,
  })
}

export function post<TResponse>(
  path: string,
  body?: BodyInit,
  headers?: HeadersInit,
): Promise<TResponse> {
  return request<TResponse>(path, {
    body,
    headers,
    method: 'POST',
  })
}
