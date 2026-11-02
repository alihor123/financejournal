import { ArrowDown } from '@/assets/icons'
import { dateToString } from '@/helpers'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Image } from 'expo-image'
import type { CSSProperties } from 'react'
import { Platform, Pressable, Text, TextInput, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import type { OperationForm, OperationModalStyles } from '.'

const categories = [
  { name: 'Продукты' },
  { name: 'Транспорт' },
  { name: 'Жильё' },
  { name: 'Подписки' },
  { name: 'Развлечения' },
  { name: 'Здоровье' },
  { name: 'Зарплата' },
  { name: 'Подработка' },
  { name: 'Подарки' },
  { name: 'Другое' }
]

type OperationFormContentProps = {
  styles: OperationModalStyles
  form: OperationForm
  balance: number
  isCalendarOpen: boolean
  onChangeForm: (data: Partial<OperationForm>) => void
  onOpenCalendar: () => void
  onSave: () => void
  onClose: () => void
}

export function OperationFormContent({ styles, form, balance, isCalendarOpen, onChangeForm, onOpenCalendar, onSave, onClose }: OperationFormContentProps) {
  const webDateStyle: CSSProperties = {
    height: 46,
    borderRadius: 16,
    fontSize: 16,
    backgroundColor: styles.input.backgroundColor,
    color: styles.input.color,
    width: '100%',
    padding: '0 14px',
    borderWidth: 0,
    boxSizing: 'border-box'
  }

  //Выбор типа операции и подстановка текущего баланса
  function changeType(type: OperationForm['type']) {
    if (type === form.type) return

    if (type === 'adjustment') {
      onChangeForm({ type, amount: String(balance / 100) })
    }
    else if (form.type === 'adjustment') {
      onChangeForm({ type, amount: '' })
    }
    else {
      onChangeForm({ type })
    }
  }

  //Ввод суммы с одним разделителем без пробелов
  function changeAmount(amount: string) {
    const value = amount.replace(/\s/g, '')

    if (value === '' || /^\d+([.,]\d*)?$/.test(value)) {
      onChangeForm({ amount: value })
    }
  }

  return (
    <>
      <View style={styles.types}>
        <View style={styles.typesRow}>
          <Pressable onPress={() => changeType('income')} style={({ pressed }) => [styles.typeButton, styles.typeHalf, form.type === 'income' && styles.typeSelected, pressed && styles.buttonPressed]}>
            <Text style={[styles.typeText, form.type === 'income' && styles.typeSelectedText]}>Доход</Text>
          </Pressable>
          <Pressable onPress={() => changeType('expense')} style={({ pressed }) => [styles.typeButton, styles.typeHalf, form.type === 'expense' && styles.typeSelected, pressed && styles.buttonPressed]}>
            <Text style={[styles.typeText, form.type === 'expense' && styles.typeSelectedText]}>Расход</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => changeType('adjustment')} style={({ pressed }) => [styles.typeButton, form.type === 'adjustment' && styles.typeSelected, pressed && styles.buttonPressed]}>
          <Text style={[styles.typeText, form.type === 'adjustment' && styles.typeSelectedText]}>Изменить баланс</Text>
        </Pressable>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>{form.type === 'adjustment' ? 'Новый баланс' : 'Сумма'}</Text>
        <TextInput
          style={styles.input}
          value={form.amount}
          onChangeText={changeAmount}
          keyboardType="decimal-pad"
          placeholder="0 ₽"
          placeholderTextColor={styles.placeholder.color}
        />
      </View>
      {form.type !== 'adjustment' && (
        <View style={styles.field}>
          <Text style={styles.label}>Категория</Text>
          <Dropdown
            style={styles.selector}
            containerStyle={styles.categoryList}
            placeholderStyle={styles.placeholder}
            selectedTextStyle={styles.categoryText}
            itemTextStyle={styles.categoryText}
            activeColor={styles.categorySelected.backgroundColor}
            data={categories}
            labelField="name"
            valueField="name"
            value={form.category}
            placeholder="Выберите категорию"
            maxHeight={220}
            autoScroll={false}
            onChange={item => onChangeForm({ category: item.name })}
            renderRightIcon={() => <Image source={ArrowDown} style={styles.categoryArrow} tintColor={styles.categoryArrow.tintColor} />}
          />
        </View>
      )}
      <View style={styles.field}>
        <Text style={styles.label}>Дата</Text>
        {Platform.OS === 'web' && (
          <input
            type="date"
            style={webDateStyle}
            value={dateToString(form.date)}
            onChange={event => {
              if (event.target.value) onChangeForm({ date: new Date(`${event.target.value}T00:00:00`) })
            }}
          />
        )}
        {Platform.OS !== 'web' && (
          <Pressable onPress={onOpenCalendar} style={({ pressed }) => [styles.dateButton, pressed && styles.buttonPressed]}>
            <Text style={styles.dateText}>{form.date.toLocaleDateString('ru-RU')}</Text>
          </Pressable>
        )}
        {Platform.OS === 'ios' && isCalendarOpen && (
          <DateTimePicker
            value={form.date}
            mode="date"
            display="inline"
            onValueChange={(_, date) => onChangeForm({ date })}
          />
        )}
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Описание</Text>
        <TextInput
          style={[styles.input, styles.description]}
          value={form.description}
          onChangeText={description => onChangeForm({ description })}
          placeholder="На что потратили или откуда получили"
          placeholderTextColor={styles.placeholder.color}
          multiline
        />
      </View>
      <View style={styles.actions}>
        <Pressable onPress={onClose} style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.buttonPressed]}>
          <Text style={[styles.buttonText, styles.cancelText]}>Отмена</Text>
        </Pressable>
        <Pressable onPress={onSave} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Сохранить</Text>
        </Pressable>
      </View>
    </>
  )
}
