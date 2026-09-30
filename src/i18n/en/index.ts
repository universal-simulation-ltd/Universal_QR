import app from './app.ts'
import studio from './studio.ts'
import controls from './controls.ts'
import dynamic from './dynamic.ts'
import scan from './scan.ts'

export const en = { app, studio, controls, dynamic, scan }

/** The shape every language must match exactly. */
export type Messages = {
  [N in keyof typeof en]: { [K in keyof (typeof en)[N]]: string }
}
