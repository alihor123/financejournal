import { createContext, useState, type ReactNode } from 'react'

export const OperationsContext = createContext({
  operationsVersion: 0,
  updateOperationsVersion: () => {}
})

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [operationsVersion, setOperationsVersion] = useState(0)

  //Уведомление статистики об успешном изменении операций
  function updateOperationsVersion() {
    setOperationsVersion(prev => prev + 1)
  }

  return (
    <OperationsContext.Provider value={{ operationsVersion, updateOperationsVersion }}>
      {children}
    </OperationsContext.Provider>
  )
}
