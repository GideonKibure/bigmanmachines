import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { SettingsProvider } from './contexts/SettingsContext'
import ScrollReveal from './components/common/ScrollReveal'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SettingsProvider>
          <AppRoutes />
          <ScrollReveal />
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                background: '#ffffff',
                color: '#171717',
                border: '1px solid #e5e5e5',
              },
            }}
          />
        </SettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
