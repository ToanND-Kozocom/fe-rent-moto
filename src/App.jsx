import { Suspense } from 'react'
import Routes from './routes'
import { GlobalStyle, LoadingOverlay } from './components/UI'
import LoadingProvider from './providers/LoadingProvider'
import SidebarActiveProvider from './providers/SidebarActiveProvider'
import AuthProvider from './providers/AuthProvider'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

function App() {
  return (
    <>
      <LoadingProvider>
        <SidebarActiveProvider>
          <AuthProvider>
            <Suspense fallback={<LoadingOverlay open />}>
              <GlobalStyle>
                <Routes />
              </GlobalStyle>
            </Suspense>
          </AuthProvider>
        </SidebarActiveProvider>
      </LoadingProvider>
    </>
  )
}

export default App
