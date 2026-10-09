import { create } from 'zustand'

export interface ConfirmOptions { title: string; message: string; confirmLabel?: string }
interface Request extends ConfirmOptions { resolve: (ok: boolean) => void }

interface ConfirmState {
  request: Request | null
  ask: (opts: ConfirmOptions) => Promise<boolean>
  answer: (ok: boolean) => void
}

export const useConfirmStore = create<ConfirmState>()((set, get) => ({
  request: null,
  ask: (opts) =>
    new Promise((resolve) => {
      get().request?.resolve(false) // a new question replaces the old one; don't leave its caller waiting forever
      set({ request: { ...opts, resolve } })
    }),
  answer: (ok) => {
    get().request?.resolve(ok)
    set({ request: null })
  },
}))
