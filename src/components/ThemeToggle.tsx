import { useEffect } from 'react'

type ThemeMode = 'light'

function getInitialMode(): ThemeMode {
  return 'light'
}

function applyThemeMode() {
  document.documentElement.classList.remove('light', 'dark')
  document.documentElement.classList.add('light')
  document.documentElement.setAttribute('data-theme', 'light')
  document.documentElement.style.colorScheme = 'light'
}

export default function ThemeToggle() {
  useEffect(() => {
    const initialMode = getInitialMode()
    applyThemeMode()
    window.localStorage.setItem('theme', initialMode)
  }, [])

  const label = 'Theme mode: light.'

  return (
    <button
      type="button"
      disabled
      aria-label={label}
      title={label}
      className="rounded-full border border-(--chip-line) bg-(--chip-bg) px-3 py-1.5 text-sm font-semibold text-(--sea-ink) shadow-[0_8px_22px_rgba(30,90,72,0.08)] transition hover:-translate-y-0.5"
    >
      Light
    </button>
  )
}
