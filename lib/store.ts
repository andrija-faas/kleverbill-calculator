import { create } from 'zustand'
import type {
  CalculatorStore,
  FormState,
  SliderState,
} from '@/types/calculator.types'

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_FORM: FormState = {
  invoiceCount: null,
  avgInvoiceValue: null,

  hscMode: 'total',
  chasingHours: 10,
  chasingHoursPerInvoice: null,
  teamMembers: 1,

  latePaymentRate: 0.20,
  unpaidRate: 0.05,
  hourlyInternalCost: 35,

  krrScenario: 'standard',
  krr: 0.50,
}

const DEFAULT_SLIDERS: SliderState = {
  lpr: 0.20,
  ur: 0.05,
  hsc: 0,
  hic: 35,
  tm: 1,
  krr: 0.50,
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCalculatorStore = create<CalculatorStore>((set, get) => ({
  view: 'form',
  formState: DEFAULT_FORM,
  sliderState: DEFAULT_SLIDERS,

  setView: (view) => set({ view }),

  setFormState: (patch) =>
    set((state) => ({
      formState: { ...state.formState, ...patch },
    })),

  setSliderState: (patch) =>
    set((state) => ({
      sliderState: { ...state.sliderState, ...patch },
    })),

  submitForm: () => {
    const { formState } = get()
    // Sync sliders to match the submitted form values
    // so the results page starts with the user's own inputs
    set({
      view: 'results',
      sliderState: {
        lpr: formState.latePaymentRate,
        ur: formState.unpaidRate,
        hsc: formState.chasingHours,
        hic: formState.hourlyInternalCost,
        tm: formState.teamMembers,
        krr: formState.krr,
      },
    })
  },

  reset: () =>
    set({
      view: 'form',
      formState: DEFAULT_FORM,
      sliderState: DEFAULT_SLIDERS,
    }),
}))
