import { RouterProvider } from 'react-router'
import { ContactProvider } from '@/lib/contact'
import { ThemeProvider } from '@/lib/theme'
import { router } from './router'

export function App() {
  return (
    <ThemeProvider>
      <ContactProvider>
        <RouterProvider router={router} />
      </ContactProvider>
    </ThemeProvider>
  )
}
