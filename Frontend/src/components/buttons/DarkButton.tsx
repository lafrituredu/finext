import { useEffect, useState } from "react"

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const root = window.document.documentElement
    darkMode ? root.classList.add("dark") : root.classList.remove("dark")
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="sm:px-6 cursor-pointer"
    >
      {darkMode ?
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#F3F3F3" className="md:w-6 w-6">
            <path d="M440-760v-160h80v160h-80Zm266 110-55-55 112-115 56 57-113 113Zm54 210v-80h160v80H760ZM440-40v-160h80v160h-80ZM254-652
            140-763l57-56 113 113-56 54Zm508 512L651-255l54-54 114 110-57 59ZM40-440v-80h160v80H40Zm157 300-56-57 112-112 29 27 29 28-114
            114Zm113-170q-70-70-70-170t70-170q70-70 170-70t170 70q70 70 70 170t-70 170q-70 70-170 70t-170-70Zm283-57q47-47 
            47-113t-47-113q-47-47-113-47t-113 47q-47 47-47 113t47 113q47 47 113 47t113-47ZM480-480Z"/>
        </svg> : 
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"  className="md:w-6 w-6">
            <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0
            90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20
            5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
        </svg>}
    </button>
  )
}