import { useDefaultView, type UseDefaultView } from '@unisim/sdk'
import { STUDIO_VIEWS, useQrStore, type StudioView } from '../../stores/qrStore'
import { CONTAINER } from '../../lib/layout'
import QrStudio from './QrStudio'
import DynamicStudio from './DynamicStudio'
import ScanStudio from './ScanStudio'
import { useT } from '../../i18n'

// Top-level shell: a QR | Scan | Dynamic switch above the studios.
//  • QR       — the free/on-device designer (QrStudio). 1D barcodes live inside
//               it, under Advanced ▸ Type — they had a tab of their own until
//               2026-08-09, which was more prominence than the usage justified.
//  • Scan     — camera scanner for QR + 1D barcodes (ZXing), on-device.
//  • Dynamic  — hosted, re-pointable QR codes with scan analytics. Free with a
//               Universal ID (until an allowance is reached). Last in the row:
//               it is the only tab that needs an account. Never labelled Pro or
//               premium (James, 2026-09-30): it is free, it just needs an ID.
export default function QrApp() {
  const view = useQrStore((s) => s.view)
  const setView = useQrStore((s) => s.setView)
  const t = useT()
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
        <div className={`${CONTAINER} py-3`}>
          <div className="u-tabs" role="tablist">
            <TopTab id="static" current={view} onClick={setView} dv={dv} label={t('app.tab_qr')} hint={t('app.tab_qr_hint')} />
            <TopTab id="scan" current={view} onClick={setView} dv={dv} label={t('app.tab_scan')} hint={t('app.tab_scan_hint')} />
            <TopTab id="dynamic" current={view} onClick={setView} dv={dv} label={t('app.tab_dynamic')} hint={t('app.tab_dynamic_hint')} />
          </div>
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
  dv,
}: {
  id: StudioView
  current: StudioView
  onClick: (v: StudioView) => void
  label: string
  hint: string
  dv: UseDefaultView<StudioView>
}) {
  const active = current === id
  const dvProps = dv.buttonProps(id, label)
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      {...dvProps}
      onClick={() => { dv.tap(id); onClick(id) }}
      // The suite's tray tabs (SDK 0.216, BRANDING.md → Tabs): aria-selected
      // selects, and buttonProps' data-default-view draws the opens-here dot
      // after the label and hint.
      className="u-tab px-2 sm:px-4"
    >
      <span className="flex flex-col items-start gap-1 text-left">
        <span>{label}</span>
        <span className="hidden text-[11px] font-medium text-slate-400 md:block">{hint}</span>
      </span>
    </button>
  )
}
