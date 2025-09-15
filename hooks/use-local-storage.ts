"use client"

import { useState, useEffect, useCallback } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load from localStorage when component mounts
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key)

        if (item) {
          try {
            const parsedItem = JSON.parse(item)
            setStoredValue(parsedItem)
          } catch (parseError) {
            console.error(`Error parsing localStorage key "${key}":`, parseError)
            window.localStorage.setItem(key, JSON.stringify(initialValue))
            setStoredValue(initialValue)
          }
        } else {
          window.localStorage.setItem(key, JSON.stringify(initialValue))
          setStoredValue(initialValue)
        }

        setIsInitialized(true)
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      setStoredValue(initialValue)
      setIsInitialized(true)
    }
  }, [key]) // Remove initialValue from dependencies

  // Return a wrapped version of useState's setter function
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue],
  )

  return [storedValue, setValue, isInitialized] as const
}
