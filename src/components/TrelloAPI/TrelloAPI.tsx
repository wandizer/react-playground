import classNames from 'classnames'
import { Suspense, useState, type JSX } from 'react'
import {
  createNewCard,
  createNewTicketCard,
  getBoard,
  getCardsOnList,
  getListsOnBoard,
} from './api-helper'
import { Board, BoardLists } from './constants'

const colorizeJSON = (json: string) => {
  return json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
      (match) => {
        let cls = 'number'
        if (/^"/.test(match)) {
          const isKey = /:$/.test(match)
          // Remove quotes and colon for keys to differentiate from string values
          match = isKey ? match.slice(1, -2) + ':' : match
          cls = isKey ? 'key' : 'string'
        } else if (/true|false/.test(match)) {
          cls = 'boolean'
        } else if (/null/.test(match)) {
          cls = 'null'
        }
        return `<span class="${classNames({
          'text-green-400': cls === 'string',
          'text-blue-400': cls === 'number',
          'text-yellow-400': cls === 'boolean',
          'text-gray-400': cls === 'null',
          'text-purple-400': cls === 'key',
        })}">${match}</span>`
      },
    )
}

function ButtonAPI({
  onClick,
  label,
  loading,
}: {
  onClick: () => void
  label: string
  loading?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {loading ? 'Loading...' : label}
    </button>
  )
}

function TrelloAPI(): JSX.Element {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<object | null>(null)

  const handleClick = async (fetchFunction: unknown) => {
    if (typeof fetchFunction !== 'function') {
      setError('Invalid fetch function')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFunction()
      setResponse(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="trello-api" className="text-white p-4">
      <h1 className="text-2xl mb-3">Trello API</h1>
      <p className="mb-4">
        This is a workspace for testing the Trello API and building
        Trello-related projects. Use the buttons below to make API calls and see
        the results.
      </p>
      {/* Horizontal button list */}
      <ul className="flex flex-row gap-4 mb-4">
        <li>
          <ButtonAPI
            loading={loading}
            label="Get Board"
            onClick={() => handleClick(() => getBoard(Board.id))}
          />
        </li>
        <li>
          <ButtonAPI
            loading={loading}
            label="Get Lists on Board"
            onClick={() => handleClick(() => getListsOnBoard(Board.id))}
          />
        </li>
        <li>
          <ButtonAPI
            loading={loading}
            label={`Get Cards on List ${BoardLists.Doing.name}`}
            onClick={() =>
              handleClick(() => getCardsOnList(BoardLists.Doing.id))
            }
          />
        </li>
        <li>
          <ButtonAPI
            loading={loading}
            label={`Get Template card`}
            onClick={() =>
              handleClick(() => getCardsOnList(BoardLists.TemplatesList.id))
            }
          />
        </li>
        <li>
          <ButtonAPI
            loading={loading}
            label={`Create new card on List ${BoardLists.Doing.name}`}
            onClick={() =>
              handleClick(() =>
                createNewCard(
                  BoardLists.Doing.id,
                  'Test Card',
                  'This is a test card',
                ),
              )
            }
          />
        </li>
        <li>
          <ButtonAPI
            loading={loading}
            label={`Create ticket card on List ${BoardLists.Doing.name}`}
            onClick={() =>
              handleClick(() =>
                createNewTicketCard({
                  issueLink:
                    'https://gitlab.com/wandizer/react-playground/-/issues/1234',
                  title: 'Test Ticket Card',
                  listId: BoardLists.Doing.id,
                  branchName: 'example/branch-name',
                  mergeRequestLink:
                    'https://gitlab.com/wandizer/react-playground/-/merge_requests/5678',
                }),
              )
            }
          />
        </li>
      </ul>
      <Suspense fallback={<p className="text-white">Loading...</p>}>
        {error && <p className="text-red-500">{error}</p>}
        {response && (
          <pre
            className="bg-gray-900 p-4 rounded mt-4 overflow-auto font-mono text-sm"
            dangerouslySetInnerHTML={{
              __html: colorizeJSON(JSON.stringify(response, null, 2)),
            }}
          />
        )}
      </Suspense>
    </div>
  )
}

export default TrelloAPI
