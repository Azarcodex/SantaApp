import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import 'leaflet/dist/leaflet.css'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <Toaster position="top-right" toastOptions={{
      style: {
        background: '#1e293b',
        color: '#fff',
        border: '1px solid #334155'
      }
    }} />
    <App />
  </QueryClientProvider>,
)
