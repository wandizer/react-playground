const BASE_URL = 'https://api.trello.com/1'

const attachCredentials = (url: string): string => {
  const key = import.meta.env.VITE_TRELLO_API_KEY
  const token = import.meta.env.VITE_TRELLO_API_TOKEN

  if (!key || !token) {
    throw new Error('Missing Trello credentials in environment variables')
  }

  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}key=${key}&token=${token}`
}

const trelloFetch = async (url: string, init: RequestInit = {}) => {
  const response = await fetch(attachCredentials(url), {
    ...init,
    headers: {
      Accept: 'application/json',
      ...init.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  return response.json()
}

export const getMyBoards = async () => {
  return trelloFetch(`${BASE_URL}/members/me/boards`, { method: 'GET' })
}
