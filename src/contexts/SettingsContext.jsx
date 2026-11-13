import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultSettings } from '../data/preview'
import { useLanguage } from './LanguageContext'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { localizeSettings } from '../utils/swahili'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const { lang } = useLanguage()
  const [raw, setRaw] = useState(defaultSettings)
  const [ready, setReady] = useState(!isSupabaseConfigured)

  async function load() {
    if (!supabase) {
      setRaw(defaultSettings)
      setReady(true)
      return
    }
    const { data, error } = await supabase.from('business_settings').select('*').eq('id', 1).maybeSingle()
    if (!error && data) {
      setRaw({ ...defaultSettings, ...data })
      if (data.business_name) document.title = data.business_name
    }
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  const settings = useMemo(() => localizeSettings(raw, lang), [raw, lang])

  const value = useMemo(
    () => ({
      settings,
      raw,
      ready,
      configured: isSupabaseConfigured,
      refresh: load,
    }),
    [settings, raw, ready],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
