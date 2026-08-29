import { AdvancedMenu } from '@unisim/sdk'
import { useQrStore } from '../../stores/qrStore'

// The per-app actions that slot into <UniversalAppsNavBar />'s `actions` prop —
// ROWS ONLY, no trigger and no panel of its own. The SDK renders them inside the
// merged profile pill, so the bar carries one dropdown on the right rather than
// an Actions button on the left and an avatar on the right.
//
// Styling is inline rather than Tailwind to match the SDK dropdown's own rows
// (the same 8px/14px rhythm and 13px label the profile and language rows use) —
// these render inside SDK chrome, not ours. The per-row hover tints are kept
// from the old panel: orange for clearing the logo, red for the destructive
// reset.
export default function AppMenu() {
  const config = useQrStore((s) => s.config)
  const reset = useQrStore((s) => s.reset)
  const clearLogo = useQrStore((s) => s.clearLogo)
  const hasLogo = !!config.logoDataUrl

  return (
    <>
      {hasLogo && (
        <MenuRow
          icon="🧹"
          tint={TINTS.warn}
          onClick={clearLogo}
          label="Remove logo"
        />
      )}

      <MenuRow
        icon="↺"
        tint={TINTS.danger}
        onClick={() => { if (confirm('Reset all settings to the defaults?')) reset() }}
        label="Reset to defaults"
      />

      {/* Advanced — the SDK's own category, so every app in the suite has one in
          the same place, and whatever goes in it next is one change rather than
          nineteen. "About this app" is always its last row. */}
      <AdvancedMenu
        about={{
          repo:    'https://github.com/universal-simulation-ltd/Universal_QR',
          subject: 'What you type',
          except:  'a code you save to your account',
          headline: 'Other QR sites build your code on their servers — and a dynamic one can be changed or tracked later.',
          version: __APP_VERSION__,
        }}
      />
    </>
  )
}

const TINTS = {
  warn:   { bg: '#fff7ed', fg: '#c2410c' },
  danger: { bg: '#fef2f2', fg: '#b91c1c' },
} as const

const REST_COLOR = '#374151'

function MenuRow({
  icon,
  label,
  tint,
  onClick,
}: {
  icon: string
  label: string
  tint: { bg: string; fg: string }
  onClick: () => void
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      style={{
        display:    'flex',
        alignItems: 'center',
        gap:        10,
        width:      '100%',
        padding:    '8px 14px',
        fontSize:   13,
        fontFamily: 'inherit',
        textAlign:  'left',
        border:     0,
        background: 'transparent',
        color:      REST_COLOR,
        cursor:     'pointer',
        transition: 'background 120ms, color 120ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = tint.bg
        e.currentTarget.style.color = tint.fg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = REST_COLOR
      }}
    >
      <span aria-hidden>{icon}</span>
      <span style={{ flex: 1, minWidth: 0, fontWeight: 500, lineHeight: 1.3 }}>{label}</span>
    </button>
  )
}
