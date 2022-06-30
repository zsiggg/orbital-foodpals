import { useContext, createContext, useState } from 'react'
import { AlertType } from 'types'

const readAlertContext = createContext(undefined)
const writeAlertContext = createContext(undefined)

// provides 2 contexts, one for setting the alert, one for reading the alert
const AlertContext = ({ children }) => {
  const [alert, setAlert] = useState()

  return (
    <readAlertContext.Provider value={alert}>
      <writeAlertContext.Provider value={setAlert}>
        {children}
      </writeAlertContext.Provider>
    </readAlertContext.Provider>
  )
}

export default AlertContext

// use this custom hook instead of calling useContext within each page to get both contexts
export const useAlert: () => [
  alert: AlertType,
  setAlert: (alert: AlertType) => void,
] = () => [useContext(readAlertContext), useContext(writeAlertContext)]
