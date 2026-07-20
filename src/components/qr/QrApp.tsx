import { useQrStore, type StudioView } from '../../stores/qrStore'
import { CONTAINER } from '../../lib/layout'
import QrStudio from './QrStudio'
import DynamicStudio from './DynamicStudio'

// Top-level shell: a Static | Dynamic switch above the two studios.
//  • Static  — the original, unchanged free/on-device QR designer (QrStudio).
//  • Dynamic — hosted, re-pointable codes with scan analytics (PRO).
// QrStudio is rendered untouched; this only adds the tab chrome around it.
export default function QrApp() {
  const view = useQrStore((s) => s.view)
  const setView = useQrStore((s) => s.setView)

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        <div className={`${CONTAINER} flex items-center gap-1 pt-3`}>
          <TopTab id="static" current={view} onClick={setView} label="Static" hint="Free · on your device" />
          <TopTab id="dynamic" current={view} onClick={setView} label="Dynamic" hint="Editable · with analytics" pro />
        </div>
      </div>

      {view === 'static' ? <QrStudio /> : <DynamicStudio />}
    </div>
  )
}

function TopTab({
  id,
  current,
  onClick,
  label,
  hint,
  pro,
}: {
  id: StudioView
  current: StudioView
  onClick: (v: StudioView) => void
  label: string
  hint: string
  pro?: boolean
}) {
  const active = current === id
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={() => onClick(id)}
      className={`group relative -mb-px flex flex-col items-start rounded-t-lg px-4 py-2.5 text-left transition-colors ${
        active ? 'border-b-2 border-orange-600' : 'border-b-2 border-transparent hover:bg-slate-50'
      }`}
    >
      <span className="flex items-center gap-1.5">
        <span className={`text-sm font-semibold ${active ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
        {pro && <span className="rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-orange-700">Pro</span>}
      </span>
      <span className="text-[11px] text-slate-400">{hint}</span>
    </button>
  )
}
