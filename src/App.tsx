import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import cloudflareLogo from './assets/Cloudflare_Logo.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [name, setName] = useState('unknown')
  const [feInput, setFeInput] = useState('')
  const isValidInput = (s: string) => {
    if (s.length >= 32) return false
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i)
      if (c >= 0xd800 && c <= 0xdbff) {
        if (i + 1 >= s.length) return false
        const d = s.charCodeAt(i + 1)
        if (!(d >= 0xdc00 && d <= 0xdfff)) return false
        i++
      } else if (c >= 0xdc00 && c <= 0xdfff) {
        return false
      }
    }
    return true
  }

  return (
    <>
      <div>
        <a href='https://vite.dev' target='_blank'>
          <img src={viteLogo} className='logo' alt='Vite logo' />
        </a>
        <a href='https://react.dev' target='_blank'>
          <img src={reactLogo} className='logo react' alt='React logo' />
        </a>
        <a href='https://workers.cloudflare.com/' target='_blank'>
          <img src={cloudflareLogo} className='logo cloudflare' alt='Cloudflare logo' />
        </a>
      </div>
      <h1>Vite + React + Cloudflare</h1>
      <div className='card'>
        <button
          onClick={() => setCount((count) => count + 1)}
          aria-label='increment'
        >
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className='card'>
        <input
          type='text'
          value={feInput}
          onChange={(e) => setFeInput(e.target.value)}
          placeholder='Enter input to send'
          aria-label='fe input'
          aria-invalid={!isValidInput(feInput)}
        />
        {!isValidInput(feInput) && (
          <p style={{ color: 'red' }}>Input must be UTF-8 text under 32 chars.</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => {
              if (!isValidInput(feInput)) return
              fetch('/api/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fe_input: feInput }),
              })
                .then((res) => res.json() as Promise<{ name: string }>)
                .then((data) => setName(data.name))
            }}
            aria-label='post name'
            disabled={!isValidInput(feInput)}
          >
            Send API call with input
          </button>
          <div
            role='status'
            aria-label='api response'
            style={{
              border: '1px solid #ccc',
              padding: '8px 12px',
              borderRadius: '6px',
              minWidth: '240px',
            }}
          >
            Response from API is: {name}
          </div>
        </div>
        <p>
          Edit <code>worker/index.ts</code> to change the name
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
