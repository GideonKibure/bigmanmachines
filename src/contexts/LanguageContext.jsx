import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext(null)
const KEY = 'mkushi-lang'

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => (localStorage.getItem(KEY) === 'en' ? 'en' : 'sw'))

  useEffect(() => {
    localStorage.setItem(KEY, lang)
    document.documentElement.lang = lang === 'en' ? 'en' : 'sw'
  }, [lang])

  const value = useMemo(() => ({ lang, setLang }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  return useContext(LanguageContext)
}
