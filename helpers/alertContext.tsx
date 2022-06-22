import { useContext, createContext, useState } from 'react'

type Alert = {
  type: 'danger' | 'warning' | 'info' | 'success'
  message: string
}

const readAlertContext = createContext(undefined)
const writeAlertContext = createContext(undefined)

// provides 2 contexts, one for setting the alert, one for reading the alert
export default ({ children }) => {
  const [alert, setAlert] = useState()

  return (
    <readAlertContext.Provider value={alert}>
      <writeAlertContext.Provider value={setAlert}>
        {children}
      </writeAlertContext.Provider>
    </readAlertContext.Provider>
  )
}

// use this custom hook instead of calling useContext within each page to get both contexts
export const useAlert: () => [
  alert: Alert,
  setAlert: (alert: Alert) => void,
] = () => [useContext(readAlertContext), useContext(writeAlertContext)]
