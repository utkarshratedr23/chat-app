import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthContextProvider } from './context/AuthContext.jsx'


createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContextProvider>
  <App />
  </AuthContextProvider>
  </BrowserRouter>
)
