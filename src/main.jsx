import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import RevealApp from './RevealApp'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RevealApp />
  </StrictMode>,
)
