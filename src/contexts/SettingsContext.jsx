import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { defaultSettings } from '../data/preview'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings)
  const [ready, setReady] = useState(!isSupabaseConfigured)

  async function load() {
    if (!supabase) {
      setSettings(defaultSettings)
      setReady(true)
      return
    }
    const { data, error } = await supabase.from('business_settings').select('*').eq('id', 1).maybeSingle()
    if (!error && data) {
      setSettings({ ...defaultSettings, ...data })
      if (data.business_name) document.title = data.business_name
    }
    setReady(true)
  }

  useEffect(() => {
    load()
  }, [])

  const value = useMemo(
    () => ({
      settings,
      ready,
      configured: isSupabaseConfigured,
      refresh: load,
    }),
    [settings, ready],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
