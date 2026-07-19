import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './contexts/NotificationContext'
import NotificationContainer from './components/Notification/NotificationContainer.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <App />
      <NotificationContainer />
    </NotificationProvider>
  </StrictMode>,
)
