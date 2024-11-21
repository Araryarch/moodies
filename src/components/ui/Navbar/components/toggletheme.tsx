import { CloudMoon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../../../lib/utils'

const ToggleTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    } else {
      document.documentElement.classList.remove('dark')
      setIsDarkMode(false)
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode
      if (newMode) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
      return newMode
    })
  }

  return (
    <div
      onClick={toggleTheme}
      className={cn('cursor-pointer z-[99999999999999]')}
    >
      {isDarkMode ? <Sun size={30} /> : <CloudMoon size={30} />}
    </div>
  )
}

export default ToggleTheme
