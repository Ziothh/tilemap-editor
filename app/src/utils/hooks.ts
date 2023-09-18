import { useState } from "react"

export const useStateObject = <T>(initialState: T | (() => T)) => {
  const [value, set] = useState(initialState);

  return {
    value,
    set,
  } as const;
}

export const useArray = <T>(initialState: T[] | (() => T[]) = []) => {
  const [array, setArray] = useState(initialState);

  return {
    value: array,
    isEmpty: array.length === 0,
    add: (value: T) => setArray(prev => [...prev, value]),
    remove: (value: T) => setArray(prev => prev.filter(x => x !== value)),
    removeIndex: (index: number) => setArray(prev => prev.filter((_, i) => i !== index)),
  } as const;
}
