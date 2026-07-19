import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { NotificationProvider } from './contexts/NotificationContext'
import NotificationContainer from './components/Notification/NotificationContainer.tsx'

window.addEventListener('error', (event) => {
  let fileName = event.filename || 'unknown';
  if (fileName.startsWith('file:///')) fileName = fileName.replace('file:///', '');
  else if (fileName.startsWith('file://')) fileName = fileName.replace('file://', '');
  
  (window as any).electronAPI?.sendError?.({
    fileName,
    lineNumber: event.lineno,
    message: event.message
  });
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = reason instanceof Error ? reason.message : String(reason);
  let fileName = 'unknown';
  let lineNumber = 0;
  
  if (reason instanceof Error && reason.stack) {
    const match = reason.stack.split('\n')[1]?.match(/(?:at\s+.*?\s+\()?(.*?):(\d+):\d+\)?/);
    if (match) {
      fileName = match[1];
      if (fileName.startsWith('file:///')) fileName = fileName.replace('file:///', '');
      else if (fileName.startsWith('file://')) fileName = fileName.replace('file://', '');
      lineNumber = parseInt(match[2], 10) || 0;
    }
  }

  (window as any).electronAPI?.sendError?.({
    fileName,
    lineNumber,
    message
  });
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationProvider>
      <App />
      <NotificationContainer />
    </NotificationProvider>
  </StrictMode>,
)
