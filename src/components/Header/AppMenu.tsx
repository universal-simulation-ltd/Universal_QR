import { AdvancedMenu, MENU } from '@unisim/sdk'
// Generated — `npm run credits` after any dependency change. Never edit it by
// hand: it is read off the installed tree, so a hand-kept list drifts from the
// lockfile the first time anyone upgrades anything, and a credits list naming a
// package we removed is worse than no list at all.
import credits from '../../generated/credits.json'
import { useQrStore } from '../../stores/qrStore'
import { useThemeStore } from '../../stores/themeStore'

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
//
// ⚠️ THE SDK PAINTS THE PANEL, NOT THESE ROWS. Once the bar is given
// `theme="dark"` the dropdown behind them turns slate-800, and any colour typed
// in here stays exactly what it was — the old hard-coded `#374151` label would
// sit on it at about 1.6:1. So every colour below comes from the SDK's own
// `MENU` palette for the resolved theme, the same table the profile and
// language rows are painted from, which is what keeps these rows matching them
// in both colourways.
//
// The light values are the ones this menu always had: `MENU.light.accentBg` /
// `accentText` ARE the old orange tint, and `dangerHoverBg` / `dangerHoverText`
// the old red one. The one exception is the resting label — see LIGHT_REST.
//
// There is no Appearance section here any more. Since SDK 0.143 the colour
// scheme is a Global preference with a per-app override in the SDK's own App
// preferences dialog (App.tsx passes `themeStore`), which the same pill opens
// from every tab — so a second copy of the control here would only be a second
// place to disagree with it.

/** The rows' resting label colour in LIGHT, unchanged from before dark mode.
 *  `MENU.light.body` is `#334155` (slate-700); this menu has always used gray-700,
 *  and light mode must render exactly as it did. Dark uses `MENU.dark.body`. */
const LIGHT_REST = '#374151'

type Tint = { bg: string; fg: string }

export default function AppMenu() {
  const config = useQrStore((s) => s.config)
  const reset = useQrStore((s) => s.reset)
  const clearLogo = useQrStore((s) => s.clearLogo)
  const hasLogo = !!config.logoDataUrl
  const theme = useThemeStore((s) => s.effective)

  const m = MENU[theme]
  const rest = theme === 'dark' ? m.body : LIGHT_REST
  const warn: Tint = { bg: m.accentBg, fg: m.accentText }
  const danger: Tint = { bg: m.dangerHoverBg, fg: m.dangerHoverText }

  return (
    <>
      {hasLogo && (
        <MenuRow
          icon="🧹"
          tint={warn}
          rest={rest}
          onClick={clearLogo}
          label="Remove logo"
        />
      )}

      <MenuRow
        icon="↺"
        tint={danger}
        rest={rest}
        onClick={() => { if (confirm('Reset all settings to the defaults?')) reset() }}
        label="Reset to defaults"
      />

      {/* Advanced — the SDK's own category, so every app in the suite has one in
          the same place, and whatever goes in it next is one change rather than
          nineteen. "About this app" is always its last row. `theme` is the
          RESOLVED one, the same value the bar gets. */}
      <AdvancedMenu
        theme={theme}
        about={{
          repo:    'https://github.com/universal-simulation-ltd/Universal_QR',
          subject: 'What you type',
          except:  'a code you save to your account',
          headline: 'Other QR sites build your code on their servers — and a dynamic one can be changed or tracked later.',
          version: __APP_VERSION__,
          credits,
          noticesHref: 'https://github.com/universal-simulation-ltd/Universal_QR/blob/main/THIRD-PARTY-NOTICES.md',
        }}
      />
    </>
  )
}

/** One row: a plain action, tinted on hover. */
function MenuRow({
  icon,
  label,
  tint,
  rest,
  onClick,
}: {
  icon: string
  label: string
  tint: Tint
  rest: string
  onClick: () => void
}) {
  const restBg = 'transparent'
  const restFg = rest
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
        background: restBg,
        color:      restFg,
        cursor:     'pointer',
        transition: 'background 120ms, color 120ms',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = tint.bg
        e.currentTarget.style.color = tint.fg
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = restBg
        e.currentTarget.style.color = restFg
      }}
    >
      <span aria-hidden>{icon}</span>
      <span style={{ flex: 1, minWidth: 0, fontWeight: 500, lineHeight: 1.3 }}>{label}</span>
    </button>
  )
}
