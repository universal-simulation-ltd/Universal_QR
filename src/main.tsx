import React from 'react'
import ReactDOM from 'react-dom/client'
import { UniversalProvider } from '@unisim/sdk'
import type { ProductCode } from '@unisim/sdk'
import App from './App'
import { useQrStore } from './stores/qrStore'
import './index.css'

if (import.meta.env.DEV) {
  ;(window as unknown as { __stores: unknown }).__stores = {
    qr: useQrStore
  }
}

// Universal QR is a fully anonymous, offline tool — it never authenticates or
// talks to Supabase. We still mount <UniversalProvider> because the shared
// navbar reads language state from its context, so we hand it harmless
// placeholders (the client is constructed but never called) and omit
// cookieDomain so the language choice stays scoped to this origin.
const universalConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-placeholder',
  // 'qr' isn't in the SDK's ProductCode union yet (it predates this app); the
  // value only scopes changelog/usage, neither of which this tool uses.
  product: 'qr' as unknown as ProductCode
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniversalProvider config={universalConfig}>
      <App />
    </UniversalProvider>
  </React.StrictMode>
)
