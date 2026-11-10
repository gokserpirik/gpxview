import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Theme } from '@astryxdesign/core/theme'
import './styles.css'
import { themes, defaultThemeSlug } from './astryx-themes'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Theme theme={themes[defaultThemeSlug]} mode="dark">
      <App />
    </Theme>
  </StrictMode>,
)
