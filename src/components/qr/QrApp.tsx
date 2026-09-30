import { useDefaultView, type UseDefaultView } from '@unisim/sdk'
import { STUDIO_VIEWS, useQrStore, type StudioView } from '../../stores/qrStore'
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
  // Double-tap a tab to open the app on it (James, 2026-09-30). The store read
  // the same default at start-up; a single tap still is not remembered.
  const dv = useDefaultView<StudioView>('view', 'static', { views: STUDIO_VIEWS })

  return (
    <div>
      <div className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        {/* No horizontal scroll: below `md` the tabs drop their hint lines and
            shrink their padding so they all fit the narrowest viewport. The
            hints only fit from ~600px, so they wait for `md` rather than `sm`
            — at `sm` they used to clear the container by 3px, which one font
            swap ate. Three tabs now, but the rule is kept: it costs nothing and
            the Dynamic hint is the longest of them. */}
        <div className={`${CONTAINER} flex items-center gap-0.5 pt-3 sm:gap-1`}>
          <TopTab id="static" current={view} onClick={setView} dv={dv} label="QR" hint="Free · on your device" />
          <TopTab id="scan" current={view} onClick={setView} dv={dv} label="Scan" hint="Camera · QR + barcodes" />
          <TopTab id="dynamic" current={view} onClick={setView} dv={dv} label="Dynamic" hint="Editable · with analytics" pro />
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
  dv,
}: {
  id: StudioView
  current: StudioView
  onClick: (v: StudioView) => void
  label: string
  hint: string
  pro?: boolean
  dv: UseDefaultView<StudioView>
}) {
  const active = current === id
  const dvProps = dv.buttonProps(id, label)
  // The tab the app opens on is orange, as Jukebox's library tabs are: filled
  // while you are on it, outlined while you are not.
  const isDefault = dvProps['data-default-view'] === 'true'
  const filled = active && isDefault
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      {...dvProps}
      onClick={() => { dv.tap(id); onClick(id) }}
      className={`group relative -mb-px flex shrink-0 flex-col items-start whitespace-nowrap rounded-t-lg px-2 py-2.5 text-left transition-colors sm:px-4 ${
        active
          ? filled
            ? 'border-b-2 border-[#E05504] bg-gradient-to-br from-[#FE8C01] to-[#E05504]'
            : 'border-b-2 border-orange-600'
          : isDefault
            ? 'border-b-2 border-transparent ring-1 ring-inset ring-orange-400/70 hover:bg-orange-50 dark:hover:bg-orange-950/40'
            : 'border-b-2 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <span className="flex items-center gap-1 sm:gap-1.5">
        <span className={`text-sm font-semibold ${
          filled
            ? 'text-white'
            : active
              ? 'text-slate-900 dark:text-white'
              : isDefault
                ? 'text-orange-700 dark:text-orange-400'
                : 'text-slate-600 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-white'
        }`}>{label}</span>
        {pro && <span className={`rounded px-1 py-0.5 text-[9px] font-bold uppercase tracking-wide sm:px-1.5 ${filled ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300'}`}>Pro</span>}
      </span>
      <span className={`hidden text-[11px] md:block ${filled ? 'text-white/85' : 'text-slate-400'}`}>{hint}</span>
    </button>
  )
}
