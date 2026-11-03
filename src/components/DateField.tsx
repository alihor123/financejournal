import { dateToString } from '@/helpers'
import { useStyles } from '@/hooks/useStyles'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { useState, type CSSProperties } from 'react'
import { Platform, Pressable, Text, View, useColorScheme } from 'react-native'

type DateFieldProps = {
  value: Date | null
  placeholder?: string
  minimumDate?: Date
  onChange: (date: Date) => void
}

export default function DateField({ value, placeholder = 'Выбрать дату', minimumDate, onChange }: DateFieldProps) {
  const styles = useStyles(colors => ({
    input: {
      minHeight: 46,
      paddingHorizontal: 14,
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: colors.surfacePressed
    },
    text: {
      fontSize: 16,
      color: colors.text
    },
    accent: {
      color: colors.primary
    },
    pressed: {
      opacity: 0.6
    }
  }))
  const [isOpen, setIsOpen] = useState(false)
  const theme = useColorScheme() === 'dark' ? 'dark' : 'light'

  //Сохранение выбранного дня без времени
  function changeDate(date: Date) {
    onChange(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
  }

  //Открытие системного календаря
  function openCalendar() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value || minimumDate || new Date(),
        minimumDate,
        mode: 'date',
        display: 'calendar',
        onValueChange: (_, date) => changeDate(date),
        positiveButton: { label: 'Выбрать', textColor: styles.accent.color },
        negativeButton: { label: 'Отмена', textColor: styles.accent.color }
      })
    }
    else {
      setIsOpen(prev => !prev)
    }
  }

  if (Platform.OS === 'web') {
    const webStyle: CSSProperties = {
      width: '100%',
      minWidth: 0,
      height: 46,
      padding: '0 14px',
      border: 0,
      borderRadius: 16,
      boxSizing: 'border-box',
      backgroundColor: styles.input.backgroundColor,
      color: styles.text.color,
      fontSize: 16,
      colorScheme: theme
    }

    return (
      <input
        type="date"
        aria-label={placeholder}
        style={webStyle}
        value={value ? dateToString(value) : ''}
        min={minimumDate ? dateToString(minimumDate) : undefined}
        onChange={event => {
          if (event.target.value) onChange(new Date(`${event.target.value}T00:00:00`))
        }}
      />
    )
  }

  return (
    <View>
      <Pressable onPress={openCalendar} style={({ pressed }) => [styles.input, pressed && styles.pressed]}>
        <Text style={styles.text}>{value ? value.toLocaleDateString('ru-RU') : placeholder}</Text>
      </Pressable>
      {Platform.OS === 'ios' && isOpen && (
        <DateTimePicker
          value={value || minimumDate || new Date()}
          minimumDate={minimumDate}
          mode="date"
          display="inline"
          themeVariant={theme}
          accentColor={styles.accent.color}
          onValueChange={(_, date) => {
            changeDate(date)
            setIsOpen(false)
          }}
        />
      )}
    </View>
  )
}
