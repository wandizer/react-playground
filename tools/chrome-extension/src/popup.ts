import './styles.css'
import { getMyBoards } from './trelloApi'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('App root not found')
}

app.innerHTML = `
  <section class="popup">
    <h1>Trello API Extension</h1>
    <p>Minimal Chrome extension skeleton.</p>
    <button id="ping-trello" type="button">Test Trello API</button>
    <pre id="output">Ready</pre>
  </section>
`

const button = document.querySelector<HTMLButtonElement>('#ping-trello')
const output = document.querySelector<HTMLPreElement>('#output')

if (!button || !output) {
  throw new Error('Popup controls are missing')
}

button.addEventListener('click', async () => {
  output.textContent = 'Loading...'

  try {
    const boards = await getMyBoards()
    output.textContent = JSON.stringify(boards, null, 2)
  } catch (error) {
    output.textContent =
      error instanceof Error ? error.message : 'Unknown error'
  }
})
