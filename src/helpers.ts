import type { Operation } from '@/components/OperationCard'
import { ToastAndroid } from 'react-native'

//Дата в формате календаря YYYY-MM-DD
export function dateToString(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

//Форматирование даты операции
export function dateFormating(date: Date) {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function showMessage(message: string) {
  ToastAndroid.show(message, ToastAndroid.SHORT)
}

export function createCsv(operations: Operation[]) {
  const types = { income: 'Доход', expense: 'Расход', adjustment: 'Изменение баланса' }
  const rows = [
    ['ID', 'Дата', 'Тип', 'Категория', 'Сумма', 'Описание'],
    ...operations.map(operation => {
      const amount = operation.type === 'expense' ? -operation.amount : operation.amount

      return [
        operation.id,
        dateToString(operation.date),
        types[operation.type],
        operation.category,
        (amount / 100).toFixed(2).replace('.', ','),
        operation.description
      ]
    })
  ]

  return '\uFEFF' + rows.map(row => row.map(value => `"${value.replace(/"/g, '""')}"`).join(';')).join('\r\n')
}
