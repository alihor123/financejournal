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
