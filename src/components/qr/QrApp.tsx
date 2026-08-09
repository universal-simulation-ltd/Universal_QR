import { useQrStore, type StudioView } from '../../stores/qrStore'
import { CONTAINER } from '../../lib/layout'
import QrStudio from './QrStudio'
import DynamicStudio from './DynamicStudio'
import ScanStudio from './ScanStudio'

// Top-level shell: a QR | Scan | Dynamic switch above the studios.
//  • QR       — the free/on-device designer (QrStudio). 1D barcodes live inside
//               it, under Advanced ▸ Type — they had a tab of their own until
//               2026-08-09, which was more prominence than the usage justified.
//  • Scan     — camera scanner for QR + 1D barcodes (ZXing), on-device.
//  • Dynamic  — hosted, re-pointable QR codes with scan analytics (PRO). Last
//               in the row: it is the only tab that isn't free/on-device.
export default function QrApp() {
  const view = useQrStore((s) => s.view)
  const setView = useQrStore((s) => s.setView)

  return (
    <div>
      <div className="border-b border-slate-200 bg-white">
        {/* No horizontal scroll: below `md` the tabs drop their hint lines and
            shrink their padding so they all fit the narrowest viewport. The
            hints only fit from ~600px, so they wait for `md` rather than `sm`
            — at `sm` they used to clear the container by 3px, which one font
            swap ate. Three tabs now, but the rule is kept: it costs nothing and
            the Dynamic hint is the longest of them. */}
        <div className={`${CONTAINER} flex items-center gap-0.5 pt-3 sm:gap-1`}>
          <TopTab id="static" current={view} onClick={setView} label="QR" hint="Free · on your device" />
          <TopTab id="scan" current={view} onClick={setView} label="Scan" hint="Camera · QR + barcodes" />
          <TopTab id="dynamic" current={view} onClick={setView} label="Dynamic" hint="Editable · with analytics" pro />
        </div>
      </div>

      {view === 'static' && <QrStudio />}
      {view === 'dynamic' && <DynamicStudio />}
      {view === 'scan' && <ScanStudio />}
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
      className={`group relative -mb-px flex shrink-0 flex-col items-start whitespace-nowrap rounded-t-lg px-2 py-2.5 text-left transition-colors sm:px-4 ${
        active ? 'border-b-2 border-orange-600' : 'border-b-2 border-transparent hover:bg-slate-50'
      }`}
    >
      <span className="flex items-center gap-1 sm:gap-1.5">
        <span className={`text-sm font-semibold ${active ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'}`}>{label}</span>
        {pro && <span className="rounded bg-orange-100 px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide text-orange-700 sm:px-1.5">Pro</span>}
      </span>
      <span className="hidden text-[11px] text-slate-400 md:block">{hint}</span>
    </button>
  )
}
