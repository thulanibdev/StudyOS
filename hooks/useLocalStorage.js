'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const item = localStorage.getItem(key)
      if (item) setValue(JSON.parse(item))
    } catch {}
    setLoaded(true)
  }, [key])

  const set = (val) => {
    try {
      const toStore = typeof val === 'function' ? val(value) : val
      setValue(toStore)
      localStorage.setItem(key, JSON.stringify(toStore))
    } catch {}
  }

  return [value, set, loaded]
}
