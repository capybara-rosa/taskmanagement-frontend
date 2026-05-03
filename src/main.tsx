import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { setTokenGetter, onUnauthorized } from './api/client'

setTokenGetter(() => localStorage.getItem('token'))
onUnauthorized(() => {
  localStorage.removeItem('token')
  window.location.replace('/login')
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
