import { MENU } from '@unisim/sdk'
import { useQrStore } from '../../stores/qrStore'
import { useThemeStore } from '../../stores/themeStore'

// The per-app actions that slot into <UniversalAppsNavBar />'s `actions` prop —
// ROWS ONLY, no trigger and no panel of its own. The SDK renders them inside the
// merged profile pill, so the bar carries one dropdown on the right rather than
// an Actions button on the left and an avatar on the right.
//
// Styling is inline rather than Tailwind to match the SDK dropdown's own rows
// (the same 8px/14px rhythm and 13px label the profile and language rows use) —
// these render inside SDK chrome, not ours. The hover tint is kept from the old
// panel: orange for clearing the logo.
//
// No "Reset to defaults" and no Advanced ▸ About here any more (2026-09-27):
// since SDK 0.161.0 both sit at the foot of "Tune this app", from the navbar's
// `onResetDefaults` and `about` props in App.tsx.
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
// `accentText` ARE the old orange tint. The one exception is the resting label —
// see LIGHT_REST.
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
  const clearLogo = useQrStore((s) => s.clearLogo)
  const hasLogo = !!config.logoDataUrl
  const theme = useThemeStore((s) => s.effective)

  const m = MENU[theme]
  const rest = theme === 'dark' ? m.body : LIGHT_REST
  const warn: Tint = { bg: m.accentBg, fg: m.accentText }

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
