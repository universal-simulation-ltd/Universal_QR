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

// Universal QR generates codes entirely client-side — it never writes to
// Supabase. We mount <UniversalProvider> for the shared navbar, and in
// production point it at the REAL suite project + set cookieDomain so a visitor
// already signed into .unisim.co.uk gets their profile/avatar (and suite-wide
// language choice) in the navbar, consistent with the other apps.
//
// The fallback is the REAL public suite project (publishable anon key — safe to
// ship; RLS is the security boundary). A placeholder fallback left the SDK on a
// dead project when the build lacked VITE_SUPABASE_* env, so the suite session
// never resolved and the navbar showed no profile/avatar. Env vars override.
const universalConfig = {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://rygfxgalojojppxmhddo.supabase.co',
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5Z2Z4Z2Fsb2pvanBweG1oZGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3NTY4MjUsImV4cCI6MjA5NDMzMjgyNX0.hLy_vt9vY_rdPKF3nL32yAuMCD604E3CH5VM7D7CaNE',
  // 'qr' isn't in the SDK's ProductCode union yet (it predates this app); the
  // value only scopes changelog/usage, neither of which this tool uses.
  product: 'qr' as unknown as ProductCode,
  cookieDomain: import.meta.env.PROD ? '.unisim.co.uk' : undefined,
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UniversalProvider config={universalConfig}>
      <App />
    </UniversalProvider>
  </React.StrictMode>
)
