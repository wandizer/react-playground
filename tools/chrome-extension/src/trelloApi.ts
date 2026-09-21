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

export const getListsOnBoard = async (boardId: string) => {
  return trelloFetch(`${BASE_URL}/boards/${boardId}/lists`, { method: 'GET' })
}

export type CreateTicketCardPayload = {
  listId: string
  title: string
  issueLink?: string
  issueLinks?: string[]
  mergeRequestLink?: string
  branchName?: string
}

export type TicketCardRequestFields = {
  name: string
  idList: string
  desc: string
}

export type TrelloCreatedCard = {
  id: string
  [key: string]: unknown
}

export type TrelloAttachment = {
  id: string
  name?: string
  url?: string
  [key: string]: unknown
}

export const buildTicketCardRequestFields = ({
  listId,
  title,
  issueLink,
  issueLinks,
  mergeRequestLink,
  branchName,
}: CreateTicketCardPayload): TicketCardRequestFields => {
  const normalizedIssueLinks = (
    issueLinks && issueLinks.length > 0
      ? issueLinks
      : issueLink
        ? [issueLink]
        : []
  ).filter(Boolean)

  const extractIssueRef = (link: string) => {
    const match = link.match(/\/(?:issues|work_items)\/(\d+)\/?$/)
    return match?.[1] || link.split('/').slice(-1)[0]
  }

  const issueRefs = normalizedIssueLinks.map((link) => extractIssueRef(link))
  const issueLinksMarkdown =
    normalizedIssueLinks.length > 0
      ? normalizedIssueLinks
          .map((link) => {
            const issueRef = extractIssueRef(link)
            return `- [#${issueRef}](${link})`
          })
          .join('\n')
      : '- ISSUE_LINK'

  const mergeRequestLinkMarkdown = mergeRequestLink
    ? `[${mergeRequestLink.split('/').slice(-1)[0]}](${mergeRequestLink})`
    : 'MERGE_REQUEST_LINK'
  const branchNameMarkdown = branchName || 'BRANCH_NAME'
  const issueRefLabel = issueRefs.length > 0 ? issueRefs.join(',') : ''

  return {
    name: `TICKET[${issueRefLabel}]: ${title}`,
    idList: listId,
    desc: `## Issue:

${issueLinksMarkdown}

---

## Branches:

> ${branchNameMarkdown}

---

## Merge-request:

> ${mergeRequestLinkMarkdown}`,
  }
}

export const createTicketCard = async ({
  listId,
  title,
  issueLink,
  issueLinks,
  mergeRequestLink,
  branchName,
}: CreateTicketCardPayload): Promise<TrelloCreatedCard> => {
  const fields = buildTicketCardRequestFields({
    listId,
    title,
    issueLink,
    issueLinks,
    mergeRequestLink,
    branchName,
  })
  const body = new URLSearchParams(fields)

  return trelloFetch(`${BASE_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
}

const setCardCoverAttachment = async (
  cardId: string,
  attachmentId: string,
): Promise<TrelloCreatedCard> => {
  const body = new URLSearchParams({ idAttachmentCover: attachmentId })

  return trelloFetch(`${BASE_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
}

export const attachImageAsCardCover = async (
  cardId: string,
  imageFile: File,
): Promise<TrelloAttachment> => {
  const formData = new FormData()
  formData.append('file', imageFile, imageFile.name)

  const attachment = (await trelloFetch(
    `${BASE_URL}/cards/${cardId}/attachments`,
    {
      method: 'POST',
      body: formData,
    },
  )) as TrelloAttachment

  if (attachment.id) {
    await setCardCoverAttachment(cardId, attachment.id)
  }

  return attachment
}
