import './styles.css'
import type { CreateTicketCardPayload } from './trelloApi'
import {
  attachImageAsCardCover,
  buildTicketCardRequestFields,
  createTicketCard,
  getListsOnBoard,
  getMyBoards,
} from './trelloApi'

const extensionApi = (globalThis as { chrome?: any }).chrome
const LIST_ID_STORAGE_KEY = 'trelloExtension.selectedListId'
const LIST_LABEL_STORAGE_KEY = 'trelloExtension.selectedListLabel'
const FIELD_SELECTORS_STORAGE_KEY = 'trelloExtension.fieldSelectors'

type ScanResult = {
  title: string
  issueLink: string
  issueLinks: string[]
  mergeRequestLink: string
  branchName: string
}

type TrelloBoard = {
  id: string
  name: string
}

type TrelloList = {
  id: string
  name: string
}

type FieldSelectorConfig = {
  title: string
  issueLink: string
  mergeRequestLink: string
  branchName: string
}

const EMPTY_FIELD_SELECTORS: FieldSelectorConfig = {
  title: '',
  issueLink: '',
  mergeRequestLink: '',
  branchName: '',
}

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

app.innerHTML = `
  <section class="popup">
    <header class="popup-header">
      <div>
        <h1>Trello API Extension</h1>
        <p>Scan GitLab MR data and create a Trello ticket.</p>
      </div>
      <button id="open-settings" class="icon-button" type="button">Settings</button>
    </header>
    <section class="ticket-form" aria-label="Create Trello ticket form">
      <p id="selected-column" class="settings-status">Selected column: none</p>

      <div class="field-label-row">
        <label for="ticket-title">Ticket title</label>
        <button class="field-selector-link icon-button" data-selector-target="selector-title" type="button">Configure</button>
      </div>
      <input id="ticket-title" type="text" placeholder="Improve loading state on dashboard" />

      <div class="field-label-row">
        <label for="issue-link">Issue link</label>
        <button class="field-selector-link icon-button" data-selector-target="selector-issue-link" type="button">Configure</button>
      </div>
      <input id="issue-link" type="url" placeholder="https://gitlab.com/group/project/-/issues/123" />

      <div class="field-label-row">
        <label for="merge-request-link">Merge request link</label>
        <button class="field-selector-link icon-button" data-selector-target="selector-merge-request-link" type="button">Configure</button>
      </div>
      <input id="merge-request-link" type="url" placeholder="https://gitlab.com/group/project/-/merge_requests/456" />

      <div class="field-label-row">
        <label for="branch-name">Branch name</label>
        <button class="field-selector-link icon-button" data-selector-target="selector-branch-name" type="button">Configure</button>
      </div>
      <input id="branch-name" type="text" placeholder="feature/mr-scan" />

      <label for="cover-dropzone">Cover image</label>
      <div id="cover-dropzone" class="cover-dropzone" tabindex="0">
        Paste an image or drag and drop it here
      </div>
      <div class="cover-actions">
        <button id="choose-cover-image" class="icon-button" type="button">Choose image</button>
        <button id="clear-cover-image" class="icon-button" type="button">Clear image</button>
      </div>
      <input id="cover-image-input" type="file" accept="image/*" hidden />
      <p id="cover-image-status" class="settings-status">No cover image selected.</p>
      <img id="cover-image-preview" class="cover-image-preview" alt="Cover image preview" hidden />

      <div class="form-actions">
        <button id="scan-host" class="icon-button" type="button">Scan</button>
        <button id="create-ticket" type="button">Create Trello Ticket</button>
      </div>
      <p id="form-status" class="settings-status">Fill the form manually or use Scan.</p>
    </section>
    <aside id="settings-panel" class="settings-panel" aria-hidden="true">
      <div class="settings-head">
        <h2>Settings</h2>
        <button id="close-settings" class="icon-button" type="button">Close</button>
      </div>

      <label for="column-select">Available Trello columns</label>
      <select id="column-select">
        <option value="">Load columns first</option>
      </select>
      <div class="form-actions">
        <button id="load-columns" class="icon-button" type="button">Load columns</button>
        <button id="save-column" class="icon-button" type="button">Save selected column</button>
      </div>

      <p id="settings-status" class="settings-status">No settings updates yet.</p>
      <p id="column-status" class="settings-status">No Trello column selected.</p>

      <section class="settings-section" aria-label="Field Selectors">
        <h3>Field selectors</h3>
        <label for="selector-title">Title selector</label>
        <div class="selector-row">
          <input id="selector-title" type="text" placeholder="h1.gl-page-title" />
          <button class="save-selector-button icon-button" data-field="title" data-input-id="selector-title" type="button">Save</button>
        </div>

        <label for="selector-issue-link">Issue link selector</label>
        <div class="selector-row">
          <input id="selector-issue-link" type="text" placeholder="a[data-testid='issuable-link']" />
          <button class="save-selector-button icon-button" data-field="issueLink" data-input-id="selector-issue-link" type="button">Save</button>
        </div>

        <label for="selector-merge-request-link">Merge request selector</label>
        <div class="selector-row">
          <input id="selector-merge-request-link" type="text" placeholder="a[data-testid='copy-reference-link']" />
          <button class="save-selector-button icon-button" data-field="mergeRequestLink" data-input-id="selector-merge-request-link" type="button">Save</button>
        </div>

        <label for="selector-branch-name">Branch selector</label>
        <div class="selector-row">
          <input id="selector-branch-name" type="text" placeholder="[data-testid='source-branch-name']" />
          <button class="save-selector-button icon-button" data-field="branchName" data-input-id="selector-branch-name" type="button">Save</button>
        </div>
      </section>

      <section class="settings-section" aria-label="Troubleshoot">
        <h3>Troubleshoot</h3>
        <button id="ping-trello" class="icon-button" type="button">Test Trello API</button>
      </section>

      <section class="settings-section" aria-label="Raw JSON Output">
        <h3>Raw scanned data</h3>
        <pre id="scanned-output">Ready</pre>
      </section>

      <section class="settings-section" aria-label="Trello Request Data">
        <h3>Trello Payload Preview</h3>
        <pre id="trello-output">Ready</pre>
      </section>
    </aside>
  </section>
`

const testApiButton = document.querySelector<HTMLButtonElement>('#ping-trello')
const scannedOutput = document.querySelector<HTMLPreElement>('#scanned-output')
const trelloOutput = document.querySelector<HTMLPreElement>('#trello-output')
const ticketTitleInput =
  document.querySelector<HTMLInputElement>('#ticket-title')
const issueLinkInput = document.querySelector<HTMLInputElement>('#issue-link')
const mergeRequestLinkInput = document.querySelector<HTMLInputElement>(
  '#merge-request-link',
)
const branchNameInput = document.querySelector<HTMLInputElement>('#branch-name')
const coverDropzone = document.querySelector<HTMLDivElement>('#cover-dropzone')
const chooseCoverImageButton = document.querySelector<HTMLButtonElement>(
  '#choose-cover-image',
)
const clearCoverImageButton =
  document.querySelector<HTMLButtonElement>('#clear-cover-image')
const coverImageInput =
  document.querySelector<HTMLInputElement>('#cover-image-input')
const coverImageStatus = document.querySelector<HTMLParagraphElement>(
  '#cover-image-status',
)
const coverImagePreview = document.querySelector<HTMLImageElement>(
  '#cover-image-preview',
)
const selectedColumnElement =
  document.querySelector<HTMLParagraphElement>('#selected-column')
const scanHostButton = document.querySelector<HTMLButtonElement>('#scan-host')
const createTicketButton =
  document.querySelector<HTMLButtonElement>('#create-ticket')
const formStatus = document.querySelector<HTMLParagraphElement>('#form-status')
const openSettingsButton =
  document.querySelector<HTMLButtonElement>('#open-settings')
const closeSettingsButton =
  document.querySelector<HTMLButtonElement>('#close-settings')
const settingsPanel = document.querySelector<HTMLElement>('#settings-panel')
const columnSelect = document.querySelector<HTMLSelectElement>('#column-select')
const loadColumnsButton =
  document.querySelector<HTMLButtonElement>('#load-columns')
const saveColumnButton =
  document.querySelector<HTMLButtonElement>('#save-column')
const settingsStatus =
  document.querySelector<HTMLParagraphElement>('#settings-status')
const columnStatus =
  document.querySelector<HTMLParagraphElement>('#column-status')
const fieldSelectorButtons = document.querySelectorAll<HTMLButtonElement>(
  '.field-selector-link',
)
const selectorTitleInput =
  document.querySelector<HTMLInputElement>('#selector-title')
const selectorIssueLinkInput = document.querySelector<HTMLInputElement>(
  '#selector-issue-link',
)
const selectorMergeRequestLinkInput = document.querySelector<HTMLInputElement>(
  '#selector-merge-request-link',
)
const selectorBranchNameInput = document.querySelector<HTMLInputElement>(
  '#selector-branch-name',
)
const saveSelectorButtons = document.querySelectorAll<HTMLButtonElement>(
  '.save-selector-button',
)

let selectedCoverImageFile: File | null = null
let selectedCoverImageUrl = ''

const updateCoverImageView = () => {
  if (!coverImageStatus || !coverImagePreview || !coverDropzone) {
    return
  }

  if (!selectedCoverImageFile || !selectedCoverImageUrl) {
    coverImageStatus.textContent = 'No cover image selected.'
    coverImagePreview.hidden = true
    coverImagePreview.removeAttribute('src')
    coverDropzone.textContent = 'Paste an image or drag and drop it here'
    return
  }

  coverImageStatus.textContent = `Selected: ${selectedCoverImageFile.name}`
  coverImagePreview.hidden = false
  coverImagePreview.src = selectedCoverImageUrl
  coverDropzone.textContent = `Ready: ${selectedCoverImageFile.name}`
}

const clearCoverImage = () => {
  if (selectedCoverImageUrl) {
    URL.revokeObjectURL(selectedCoverImageUrl)
  }

  selectedCoverImageFile = null
  selectedCoverImageUrl = ''

  if (coverImageInput) {
    coverImageInput.value = ''
  }

  updateCoverImageView()
}

const setCoverImageFile = (candidate: File | null) => {
  if (!candidate) {
    return
  }

  if (!candidate.type.startsWith('image/')) {
    if (coverImageStatus) {
      coverImageStatus.textContent = 'Only image files can be used as cover.'
    }
    return
  }

  if (selectedCoverImageUrl) {
    URL.revokeObjectURL(selectedCoverImageUrl)
  }

  selectedCoverImageFile = candidate
  selectedCoverImageUrl = URL.createObjectURL(candidate)
  updateCoverImageView()
}

const buildCreateTicketPayloadFromForm = (): CreateTicketCardPayload => {
  const storedListId = localStorage.getItem(LIST_ID_STORAGE_KEY)
  const issueLinks = issueLinkInput!.value
    .split(/[,\n]/)
    .map((value) => value.trim())
    .filter(Boolean)

  return {
    listId: storedListId || '',
    title: ticketTitleInput!.value.trim(),
    issueLink: issueLinks[0] || undefined,
    issueLinks: issueLinks.length > 0 ? issueLinks : undefined,
    mergeRequestLink: mergeRequestLinkInput!.value.trim() || undefined,
    branchName: branchNameInput!.value.trim() || undefined,
  }
}

const renderScannedOutput = (scanResult?: ScanResult) => {
  scannedOutput!.textContent = JSON.stringify(
    {
      scanResult,
    },
    null,
    2,
  )
}

const renderTrelloOutput = ({
  payload,
  response,
  error,
  coverAttachment,
}: {
  payload?: CreateTicketCardPayload
  response?: unknown
  error?: string
  coverAttachment?: unknown
}) => {
  const payloadPreview = payload
    ? buildTicketCardRequestFields(payload)
    : buildTicketCardRequestFields(buildCreateTicketPayloadFromForm())

  trelloOutput!.textContent = JSON.stringify(
    {
      trelloPayloadPreview: payloadPreview,
      trelloResponse: response,
      trelloCoverAttachment: coverAttachment,
      error,
    },
    null,
    2,
  )
}

if (!testApiButton || !scannedOutput || !trelloOutput) {
  throw new Error('Popup controls are missing')
}

if (
  !ticketTitleInput ||
  !issueLinkInput ||
  !mergeRequestLinkInput ||
  !branchNameInput ||
  !coverDropzone ||
  !chooseCoverImageButton ||
  !clearCoverImageButton ||
  !coverImageInput ||
  !coverImageStatus ||
  !coverImagePreview ||
  !selectedColumnElement ||
  !scanHostButton ||
  !createTicketButton ||
  !formStatus ||
  !openSettingsButton ||
  !closeSettingsButton ||
  !settingsPanel ||
  !columnSelect ||
  !loadColumnsButton ||
  !saveColumnButton ||
  !settingsStatus ||
  !columnStatus ||
  fieldSelectorButtons.length === 0 ||
  !selectorTitleInput ||
  !selectorIssueLinkInput ||
  !selectorMergeRequestLinkInput ||
  !selectorBranchNameInput ||
  saveSelectorButtons.length === 0
) {
  throw new Error('Settings controls are missing')
}

updateCoverImageView()

chooseCoverImageButton.addEventListener('click', () => {
  coverImageInput.click()
})

clearCoverImageButton.addEventListener('click', () => {
  clearCoverImage()
})

coverImageInput.addEventListener('change', () => {
  const file = coverImageInput.files?.[0] || null
  setCoverImageFile(file)
})

coverDropzone.addEventListener('dragover', (event) => {
  event.preventDefault()
  coverDropzone.classList.add('is-dragover')
})

coverDropzone.addEventListener('click', () => {
  coverImageInput.click()
})

coverDropzone.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    coverImageInput.click()
  }
})

coverDropzone.addEventListener('dragleave', () => {
  coverDropzone.classList.remove('is-dragover')
})

coverDropzone.addEventListener('drop', (event) => {
  event.preventDefault()
  coverDropzone.classList.remove('is-dragover')

  const transfer = event.dataTransfer
  if (!transfer || transfer.files.length === 0) {
    return
  }

  setCoverImageFile(transfer.files.item(0))
})

coverDropzone.addEventListener('paste', (event) => {
  const items = event.clipboardData?.items || []

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile()
      setCoverImageFile(file)
      event.preventDefault()
      return
    }
  }
})

const getFieldSelectorsFromStorage = (): FieldSelectorConfig => {
  const raw = localStorage.getItem(FIELD_SELECTORS_STORAGE_KEY)

  if (!raw) {
    return { ...EMPTY_FIELD_SELECTORS }
  }

  try {
    const parsed = JSON.parse(raw) as Partial<FieldSelectorConfig>
    return {
      title: parsed.title || '',
      issueLink: parsed.issueLink || '',
      mergeRequestLink: parsed.mergeRequestLink || '',
      branchName: parsed.branchName || '',
    }
  } catch {
    return { ...EMPTY_FIELD_SELECTORS }
  }
}

const syncFieldSelectorInputs = () => {
  const selectors = getFieldSelectorsFromStorage()
  selectorTitleInput.value = selectors.title
  selectorIssueLinkInput.value = selectors.issueLink
  selectorMergeRequestLinkInput.value = selectors.mergeRequestLink
  selectorBranchNameInput.value = selectors.branchName
}

const saveSingleFieldSelector = (
  field: keyof FieldSelectorConfig,
  value: string,
) => {
  const current = getFieldSelectorsFromStorage()
  const nextSelectors: FieldSelectorConfig = {
    ...current,
    [field]: value,
  }

  localStorage.setItem(
    FIELD_SELECTORS_STORAGE_KEY,
    JSON.stringify(nextSelectors),
  )
}

const updateSelectedColumnText = () => {
  const selectedLabel = localStorage.getItem(LIST_LABEL_STORAGE_KEY)
  selectedColumnElement.textContent = selectedLabel
    ? `Selected column: ${selectedLabel}`
    : 'Selected column: none'
}

const updateColumnStatusFromStorage = () => {
  const selectedLabel = localStorage.getItem(LIST_LABEL_STORAGE_KEY)
  columnStatus.textContent = selectedLabel
    ? `Selected Trello column: ${selectedLabel}`
    : 'No Trello column selected.'
}

const loadTrelloColumns = async () => {
  columnStatus.textContent = 'Loading Trello columns...'

  try {
    const boards = (await getMyBoards()) as TrelloBoard[]
    const listPairs = await Promise.all(
      boards.map(async (board) => {
        const lists = (await getListsOnBoard(board.id)) as TrelloList[]
        return lists.map((list) => ({
          value: list.id,
          label: `${board.name} / ${list.name}`,
        }))
      }),
    )

    const options = listPairs.flat()
    columnSelect.innerHTML = ''

    const placeholderOption = document.createElement('option')
    placeholderOption.value = ''
    placeholderOption.textContent = options.length
      ? 'Choose a column'
      : 'No columns found'
    columnSelect.append(placeholderOption)

    for (const option of options) {
      const optionNode = document.createElement('option')
      optionNode.value = option.value
      optionNode.textContent = option.label
      columnSelect.append(optionNode)
    }

    const savedListId = localStorage.getItem(LIST_ID_STORAGE_KEY)
    if (savedListId) {
      columnSelect.value = savedListId
    }

    if (savedListId && columnSelect.value === savedListId) {
      const selectedOptionText =
        columnSelect.selectedOptions.length > 0
          ? columnSelect.selectedOptions[0].textContent || ''
          : ''
      const selectedLabel =
        localStorage.getItem(LIST_LABEL_STORAGE_KEY) || selectedOptionText || ''
      columnStatus.textContent = `Selected Trello column: ${selectedLabel}`
      return
    }

    columnStatus.textContent =
      options.length > 0
        ? `Loaded ${options.length} columns.`
        : 'No columns available on your boards.'
  } catch (error) {
    columnStatus.textContent =
      error instanceof Error ? error.message : 'Unable to load Trello columns.'
  }
}

const scanActivePage = async (
  fieldSelectors: FieldSelectorConfig,
): Promise<ScanResult> => {
  if (!extensionApi?.tabs || !extensionApi?.scripting) {
    throw new Error('Chrome extension APIs are unavailable here.')
  }

  const [activeTab] = await extensionApi.tabs.query({
    active: true,
    currentWindow: true,
  })

  if (!activeTab?.id) {
    throw new Error('No active tab found.')
  }

  const [result] = await extensionApi.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: (selectorConfig: FieldSelectorConfig) => {
      const ISSUE_PATH_REGEX = /\/(?:-\/)?(?:issues|work_items)\/\d+\/?$/
      const MERGE_REQUEST_PATH_REGEX = /\/(?:-\/)?merge_requests\/\d+\/?$/
      const ISSUE_HASH_REGEX = /#\d+\b/

      const toAbsoluteUrl = (value: string): string => {
        try {
          return new URL(value, window.location.origin).href
        } catch {
          return ''
        }
      }

      const findResourceLink = (text: string, pathRegex: RegExp): string => {
        const tokens = text
          .split(/\s+/)
          .map((token) => token.replace(/^[('"`]+|[)'"`,.;]+$/g, ''))
          .filter(Boolean)

        for (const token of tokens) {
          const href = toAbsoluteUrl(token)

          if (!href) {
            continue
          }

          try {
            const parsed = new URL(href)
            if (pathRegex.test(parsed.pathname)) {
              return parsed.href
            }
          } catch {
            continue
          }
        }

        return ''
      }

      const findResourceLinkFromAnchors = (pathRegex: RegExp): string => {
        const anchors = Array.from(document.querySelectorAll('a[href]'))

        for (const anchor of anchors) {
          const rawHref = anchor.getAttribute('href') || ''
          const absoluteHref = toAbsoluteUrl(rawHref)

          if (!absoluteHref) {
            continue
          }

          try {
            const parsed = new URL(absoluteHref)
            if (pathRegex.test(parsed.pathname)) {
              return parsed.href
            }
          } catch {
            continue
          }
        }

        return ''
      }

      const findIssueLinksInDescription = (
        preferredFieldSelector: string,
      ): string[] => {
        const descriptionRoot = document.querySelector(
          '[data-testid="description-content"], .description.js-task-list-container, .merge-request-description, .js-task-list-container',
        )

        if (!(descriptionRoot instanceof HTMLElement)) {
          return []
        }

        const links: string[] = []
        const pushUnique = (href: string) => {
          if (href && !links.includes(href)) {
            links.push(href)
          }
        }

        const collectFromAnchors = (anchors: HTMLAnchorElement[]) => {
          for (const anchor of anchors) {
            const text = (anchor.textContent || '').trim()
            if (!ISSUE_HASH_REGEX.test(text)) {
              continue
            }

            const absolute = toAbsoluteUrl(anchor.getAttribute('href') || '')
            if (!absolute) {
              continue
            }

            try {
              const parsed = new URL(absolute)
              if (ISSUE_PATH_REGEX.test(parsed.pathname)) {
                pushUnique(parsed.href)
              }
            } catch {
              continue
            }
          }
        }

        if (preferredFieldSelector) {
          const preferredNode = document.querySelector(preferredFieldSelector)
          if (
            preferredNode instanceof HTMLElement &&
            descriptionRoot.contains(preferredNode)
          ) {
            const preferredAnchors =
              preferredNode instanceof HTMLAnchorElement
                ? [preferredNode]
                : Array.from(
                    preferredNode.querySelectorAll<HTMLAnchorElement>(
                      'a[href]',
                    ),
                  )
            collectFromAnchors(preferredAnchors)
          }
        }

        const descriptionAnchors = Array.from(
          descriptionRoot.querySelectorAll<HTMLAnchorElement>('a[href]'),
        )
        collectFromAnchors(descriptionAnchors)

        return links
      }

      const pickText = (
        selectors: string[],
        preferredFieldSelector: string,
      ): string => {
        const allSelectors = preferredFieldSelector
          ? [preferredFieldSelector, ...selectors]
          : selectors

        for (const lookupSelector of allSelectors) {
          const node = document.querySelector(lookupSelector)
          const text = node ? (node.textContent || '').trim() : ''
          if (text) {
            return text
          }
        }
        return ''
      }

      const pickClipboardText = (
        selectors: string[],
        preferredFieldSelector: string,
      ): string => {
        const allSelectors = preferredFieldSelector
          ? [preferredFieldSelector, ...selectors]
          : selectors

        for (const lookupSelector of allSelectors) {
          const node = document.querySelector(lookupSelector)

          if (!node) {
            continue
          }

          const readClipboardText = (target: Element | null): string => {
            if (!(target instanceof HTMLElement)) {
              return ''
            }

            return (
              target.getAttribute('data-clipboard-text') ||
              target.getAttribute('data-clipboard') ||
              ''
            ).trim()
          }

          const ownValue = readClipboardText(node)
          if (ownValue) {
            return ownValue
          }

          const closestButton = node.closest('[data-clipboard-text]')
          const closestValue = readClipboardText(closestButton)
          if (closestValue) {
            return closestValue
          }

          const nestedClipboardNode = node.querySelector(
            '[data-clipboard-text]',
          )
          const nestedValue = readClipboardText(nestedClipboardNode)
          if (nestedValue) {
            return nestedValue
          }
        }

        return ''
      }

      const pickLink = (
        pathRegex: RegExp,
        preferredFieldSelector: string,
      ): string => {
        if (!preferredFieldSelector) {
          return ''
        }

        const node = document.querySelector(preferredFieldSelector)

        if (!node) {
          return ''
        }

        const anchorCandidates: HTMLAnchorElement[] = []
        if (node instanceof HTMLAnchorElement) {
          anchorCandidates.push(node)
        }

        const closestAnchor = node.closest('a')
        if (closestAnchor instanceof HTMLAnchorElement) {
          anchorCandidates.push(closestAnchor)
        }

        const nestedAnchors = Array.from(node.querySelectorAll('a[href]'))
        for (const nestedAnchor of nestedAnchors) {
          if (nestedAnchor instanceof HTMLAnchorElement) {
            anchorCandidates.push(nestedAnchor)
          }
        }

        for (const anchor of anchorCandidates) {
          const raw = anchor.getAttribute('href') || ''
          const absolute = toAbsoluteUrl(raw)

          if (!absolute) {
            continue
          }

          try {
            const parsed = new URL(absolute)
            if (pathRegex.test(parsed.pathname)) {
              return parsed.href
            }
          } catch {
            continue
          }
        }

        const hrefRaw =
          node instanceof HTMLAnchorElement
            ? node.getAttribute('href') || ''
            : ''
        const href = hrefRaw ? toAbsoluteUrl(hrefRaw) : ''
        const text = (node.textContent || '').trim()
        const candidate = `${hrefRaw}\n${href}\n${text}`

        const matched = findResourceLink(candidate, pathRegex)
        if (matched) {
          return matched
        }

        if (href) {
          try {
            const parsed = new URL(href)
            if (pathRegex.test(parsed.pathname)) {
              return parsed.href
            }
          } catch {
            return ''
          }
        }

        return ''
      }

      const pageText = document.body.innerText || ''
      const issueLinksFromDescription = findIssueLinksInDescription(
        selectorConfig.issueLink,
      )

      const titleFromDom = pickText(
        [
          'h1.gl-page-title',
          '[data-testid="title-content"] h1',
          '.merge-request-title h1',
        ],
        selectorConfig.title,
      )

      const branchFromDom = pickText(
        [
          '[data-testid="source-branch-name"]',
          '.source-branch .ref-name',
          '.ref-name',
        ],
        selectorConfig.branchName,
      )

      const branchFromClipboard = pickClipboardText(
        [
          'button.js-source-branch-copy[data-clipboard-text]',
          '[aria-label="Copy branch name"][data-clipboard-text]',
          '[data-testid="source-branch-copy"][data-clipboard-text]',
        ],
        selectorConfig.branchName,
      )

      const mergeRequestFromSelector = pickLink(
        MERGE_REQUEST_PATH_REGEX,
        selectorConfig.mergeRequestLink,
      )
      const mergeRequestFromPage =
        findResourceLink(pageText, MERGE_REQUEST_PATH_REGEX) ||
        findResourceLinkFromAnchors(MERGE_REQUEST_PATH_REGEX)

      const mergeRequestLink =
        mergeRequestFromSelector ||
        mergeRequestFromPage ||
        (window.location.href.includes('/-/merge_requests/')
          ? window.location.href
          : '')

      return {
        title:
          titleFromDom ||
          document.title.replace(/\s*[\u00b7|-]\s*GitLab.*$/i, '').trim(),
        issueLink: issueLinksFromDescription[0] || '',
        issueLinks: issueLinksFromDescription,
        mergeRequestLink,
        branchName: branchFromDom || branchFromClipboard,
      }
    },
    args: [fieldSelectors],
  })

  if (!result?.result) {
    throw new Error('Unable to collect data from active page.')
  }

  return result.result as ScanResult
}

updateSelectedColumnText()
updateColumnStatusFromStorage()
syncFieldSelectorInputs()

const setSettingsState = (isOpen: boolean) => {
  settingsPanel.classList.toggle('is-open', isOpen)
  settingsPanel.setAttribute('aria-hidden', String(!isOpen))
}

openSettingsButton.addEventListener('click', () => {
  updateSelectedColumnText()
  updateColumnStatusFromStorage()
  syncFieldSelectorInputs()
  setSettingsState(true)
})
closeSettingsButton.addEventListener('click', () => setSettingsState(false))

loadColumnsButton.addEventListener('click', async () => {
  await loadTrelloColumns()
})

saveColumnButton.addEventListener('click', () => {
  const selectedId = columnSelect.value
  const selectedLabel =
    columnSelect.selectedOptions.length > 0
      ? columnSelect.selectedOptions[0].textContent || ''
      : ''

  if (!selectedId) {
    columnStatus.textContent = 'Please select a Trello column first.'
    return
  }

  localStorage.setItem(LIST_ID_STORAGE_KEY, selectedId)
  localStorage.setItem(LIST_LABEL_STORAGE_KEY, selectedLabel)
  updateSelectedColumnText()
  columnStatus.textContent = `Saved column: ${selectedLabel}`
})

for (const saveButton of saveSelectorButtons) {
  saveButton.addEventListener('click', () => {
    const field = saveButton.dataset.field as
      | keyof FieldSelectorConfig
      | undefined
    const inputId = saveButton.dataset.inputId

    if (!field || !inputId) {
      return
    }

    const input = document.getElementById(inputId)
    if (!(input instanceof HTMLInputElement)) {
      return
    }

    saveSingleFieldSelector(field, input.value.trim())
    settingsStatus.textContent = `Saved selector for ${field}.`
  })
}

for (const selectorButton of fieldSelectorButtons) {
  selectorButton.addEventListener('click', () => {
    const targetId = selectorButton.dataset.selectorTarget

    updateSelectedColumnText()
    updateColumnStatusFromStorage()
    syncFieldSelectorInputs()
    setSettingsState(true)

    if (!targetId) {
      return
    }

    const targetInput = document.getElementById(targetId)
    if (!(targetInput instanceof HTMLInputElement)) {
      return
    }

    targetInput.focus()
    targetInput.select()
    targetInput.scrollIntoView({ block: 'center' })
  })
}

scanHostButton.addEventListener('click', async () => {
  formStatus.textContent = 'Scanning active page...'

  try {
    const fieldSelectors = getFieldSelectorsFromStorage()
    const scanned = await scanActivePage(fieldSelectors)

    if (scanned.title) {
      ticketTitleInput.value = scanned.title
    }

    if (scanned.issueLink) {
      issueLinkInput.value =
        scanned.issueLinks.length > 0
          ? scanned.issueLinks.join(', ')
          : scanned.issueLink
    }

    if (scanned.mergeRequestLink) {
      mergeRequestLinkInput.value = scanned.mergeRequestLink
    }

    if (scanned.branchName) {
      branchNameInput.value = scanned.branchName
    }

    formStatus.textContent =
      'Scan complete. Review fields before creating ticket.'
    renderScannedOutput(scanned)
    renderTrelloOutput({ payload: buildCreateTicketPayloadFromForm() })
  } catch (error) {
    formStatus.textContent =
      error instanceof Error ? error.message : 'Scan failed.'
  }
})

createTicketButton.addEventListener('click', async () => {
  const payload = buildCreateTicketPayloadFromForm()

  if (!payload.listId) {
    formStatus.textContent =
      'Select a Trello column in Settings before creating a ticket.'
    return
  }

  if (!payload.title) {
    formStatus.textContent = 'Ticket title is required.'
    return
  }

  formStatus.textContent = 'Creating Trello ticket...'
  renderTrelloOutput({ payload })

  try {
    const response = await createTicketCard(payload)
    let coverAttachment: unknown
    let coverError = ''

    if (selectedCoverImageFile) {
      const cardId =
        typeof response === 'object' &&
        response !== null &&
        'id' in response &&
        typeof response.id === 'string'
          ? response.id
          : ''

      if (!cardId) {
        coverError =
          'Ticket was created but cover upload was skipped (missing card id).'
      } else {
        try {
          coverAttachment = await attachImageAsCardCover(
            cardId,
            selectedCoverImageFile,
          )
        } catch (coverUploadError) {
          coverError =
            coverUploadError instanceof Error
              ? `Ticket created, but cover upload failed: ${coverUploadError.message}`
              : 'Ticket created, but cover upload failed.'
        }
      }
    }

    formStatus.textContent = coverError || 'Trello ticket created successfully.'
    renderTrelloOutput({
      payload,
      response,
      coverAttachment,
      error: coverError,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Ticket creation failed.'
    formStatus.textContent = message
    renderTrelloOutput({ payload, error: message })
  }
})

testApiButton.addEventListener('click', async () => {
  trelloOutput.textContent = 'Loading...'

  try {
    const boards = await getMyBoards()
    trelloOutput.textContent = JSON.stringify(
      {
        trelloApiBoards: boards,
      },
      null,
      2,
    )
  } catch (error) {
    trelloOutput.textContent = JSON.stringify(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      null,
      2,
    )
  }
})
