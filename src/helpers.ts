import { ToastAndroid } from 'react-native'

//Форматирование даты операции
export function dateFormating(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

//Короткое сообщение об ошибке
export function showMessage(message: string) {
  ToastAndroid.show(message, ToastAndroid.SHORT)
}
