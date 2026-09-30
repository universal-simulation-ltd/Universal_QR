import { useEffect, useState } from 'react'
import { Chip } from '@unisim/sdk'
import { useQrStore } from '../../stores/qrStore'
import { qrDisplayName } from '@unisim/qr'
import { renderThumbnailDataUrl } from '../../lib/download'
import {
  loadLocalDesigns,
  saveLocalDesign,
  removeLocalDesign,
  type LocalDesign,
} from '../../lib/localDesigns'
import { useT } from '../../i18n'

// Free, no-account "Save to this device" — keep the QR codes you design in this
// browser and reopen them later. Cross-device / online save lives in the same
// backup dialog under the Universal ID sign-in.
export default function SavePanel() {
  const t = useT()
  const config = useQrStore((s) => s.config)
  const applyPatch = useQrStore((s) => s.applyPatch)
  const setMode = useQrStore((s) => s.setMode)

  const [saved, setSaved] = useState<LocalDesign[]>([])
  const [busy, setBusy] = useState(false)
  const [justSaved, setJustSaved] = useState(false)

  const hasData = config.data.trim().length > 0

  useEffect(() => {
    setSaved(loadLocalDesigns())
  }, [])

  async function onSave() {
    if (!hasData || busy) return
    setBusy(true)
    try {
      const thumbnail = await renderThumbnailDataUrl(config)
      setSaved(saveLocalDesign({ name: qrDisplayName(config), config, thumbnail }))
      setJustSaved(true)
      window.setTimeout(() => setJustSaved(false), 1800)
    } catch (err) {
      console.error(err)
      alert(t('studio.save_failed', { message: (err as Error).message }))
    } finally {
      setBusy(false)
    }
  }

  // Restore the whole design. The stored config carries every field (including
  // any uploaded logo), so a full patch replaces the current one; jump to
  // Advanced so the restored styling is visible and editable.
  function onOpen(design: LocalDesign) {
    applyPatch(design.config)
    setMode('advanced')
  }

  function onRemove(id: string) {
    setSaved(removeLocalDesign(id))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{t('studio.save_title')}</span>
        <Chip size="sm">{t('studio.no_account')}</Chip>
      </div>
      <p className="text-xs text-slate-500 -mt-1.5 dark:text-slate-400">
        {t('studio.save_body')}
      </p>

      <button
        type="button"
        onClick={onSave}
        disabled={!hasData || busy}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold shadow-sm hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
      >
        <svg viewBox="0 0 20 20" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 3h8l2 2v12H5V3z M8 3v4h4 M7 12h6 M7 15h6" />
        </svg>
        {justSaved
          ? t('studio.saved')
          : busy
            ? t('studio.saving')
            : !hasData
              ? t('studio.enter_url_to_save')
              : t('studio.save_to_device')}
      </button>

      {saved.length > 0 && (
        <ul className="space-y-2">
          {saved.map((design) => (
            <li
              key={design.id}
              className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-white ring-1 ring-slate-200 dark:ring-slate-600">
                <img src={design.thumbnail} alt="" className="h-full w-full object-contain" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-slate-700 dark:text-slate-200">
                  {design.name || t('studio.untitled_design')}
                </span>
                <span className="block truncate text-[10px] text-slate-400" title={design.config.data}>
                  {design.config.data}
                </span>
              </span>
              <button
                type="button"
                onClick={() => onOpen(design)}
                className="shrink-0 rounded-md bg-orange-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-800"
              >
                {t('studio.open')}
              </button>
              <button
                type="button"
                onClick={() => onRemove(design.id)}
                aria-label={design.name ? t('studio.remove_design_aria', { name: design.name }) : t('studio.remove_saved_design_aria')}
                className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-slate-400 hover:text-rose-600 dark:hover:text-rose-400"
              >
                {t('studio.remove')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
