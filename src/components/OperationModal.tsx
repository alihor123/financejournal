import { ArrowDown, Close } from '@/assets/icons'
import { dateToString, showMessage } from '@/helpers'
import { useStyles } from '@/hooks/useStyles'
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { useState, type CSSProperties, type RefObject } from 'react'
import { Dropdown } from 'react-native-element-dropdown'
import { Modal, Platform, Pressable, ScrollView, Text, TextInput, View, type ViewInstance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export type OperationForm = {
  type: 'income' | 'expense' | 'adjustment'
  category: string
  amount: string
  date: Date
  description: string
}

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

type OperationModalProps = {
  modalOpen: boolean
  balance: number
  onSave: (form: OperationForm) => void
  blurTarget: RefObject<ViewInstance | null>
  onClose: () => void
}

export default function OperationModal({ modalOpen, balance, blurTarget, onSave, onClose }: OperationModalProps) {
  const styles = useStyles((colors) => ({
    container: {
      flex: 1
    },
    backdrop: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      backgroundColor: colors.overlay
    },
    wrapper: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center'
    },
    modal: {
      width: '100%',
      maxWidth: 400,
      maxHeight: '100%',
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.surface
    },
    scroll: {
      flexGrow: 0
    },
    content: {
      gap: 16
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfacePressed
    },
    closeIcon: {
      width: 20,
      height: 20,
      tintColor: colors.textSecondary
    },
    title: {
      flex: 1,
      fontSize: 22,
      fontWeight: '700',
      color: colors.text
    },
    types: {
      gap: 8
    },
    typesRow: {
      flexDirection: 'row',
      gap: 8
    },
    typeHalf: {
      flex: 1
    },
    typeButton: {
      minWidth: 0,
      minHeight: 44,
      paddingHorizontal: 6,
      paddingVertical: 8,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: colors.surfacePressed
    },
    typeSelected: {
      backgroundColor: colors.balanceSurface
    },
    typeText: {
      fontSize: 14,
      lineHeight: 20,
      textAlign: 'center',
      fontWeight: '500',
      color: colors.textSecondary
    },
    typeSelectedText: {
      color: colors.onSurfaceSoft
    },
    field: {
      gap: 8
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      color: colors.text
    },
    input: {
      height: 46,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: 16,
      backgroundColor: colors.surfacePressed,
      fontSize: 16,
      color: colors.text
    },
    dateButton: {
      height: 46,
      paddingHorizontal: 14,
      justifyContent: 'center',
      borderRadius: 16,
      backgroundColor: colors.surfacePressed
    },
    dateText: {
      fontSize: 16,
      color: colors.text
    },
    selector: {
      height: 46,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: colors.surfacePressed
    },
    categoryList: {
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
      backgroundColor: colors.surface
    },
    categoryText: {
      fontSize: 16,
      color: colors.text
    },
    categorySelected: {
      backgroundColor: colors.balanceSurface
    },
    categoryArrow: {
      width: 18,
      height: 18,
      tintColor: colors.textSecondary
    },
    placeholder: {
      color: colors.textSecondary
    },
    description: {
      height: 80,
      textAlignVertical: 'top'
    },
    actions: {
      flexDirection: 'row',
      gap: 10
    },
    button: {
      flex: 1,
      minHeight: 44,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 999,
      backgroundColor: colors.primary
    },
    cancelButton: {
      backgroundColor: colors.surfacePressed
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.onPrimary
    },
    cancelText: {
      color: colors.text
    },
    buttonPressed: {
      opacity: 0.6
    }
  }))

  const webDateStyle: CSSProperties = {
    ...styles.input,
    width: '100%',
    padding: '0 14px',
    borderWidth: 0,
    boxSizing: 'border-box'
  }

  const [form, setForm] = useState<OperationForm>(() => ({
    type: 'expense',
    category: '',
    amount: '',
    date: new Date(),
    description: ''
  }))
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)

  //Изменение полей формы
  function changeForm(data: Partial<OperationForm>) {
    setForm(prev => ({ ...prev, ...data }))
  }

  //Выбор типа операции и подстановка текущего баланса
  function changeType(type: OperationForm['type']) {
    if (type === form.type) return

    if (type === 'adjustment') {
      changeForm({ type, amount: String(balance / 100) })
    }
    else if (form.type === 'adjustment') {
      changeForm({ type, amount: '' })
    }
    else {
      changeForm({ type })
    }
  }

  //Ввод суммы с одним разделителем без пробелов
  function changeAmount(amount: string) {
    const value = amount.replace(/\s/g, '')

    if (value === '' || /^\d+([.,]\d*)?$/.test(value)) {
      changeForm({ amount: value })
    }
  }

  //Проверка и подготовка формы перед сохранением
  function validateForm() {
    const value = form.amount.replace(',', '.')

    if (!value) {
      showMessage('Введите сумму')
      return false
    }

    const amount = Math.round((Number(value) + Number.EPSILON) * 100)

    if (form.type !== 'adjustment' && amount === 0) {
      showMessage('Сумма дохода или расхода должна быть больше нуля')
      return false
    }

    if (form.type !== 'adjustment' && !form.category) {
      showMessage('Выберите категорию')
      return false
    }

    changeForm({ amount: value })
    return true
  }

  //Сохранение операции после проверки полей
  function saveOperation() {
    if (!validateForm()) return

    onSave({ ...form, amount: form.amount.replace(',', '.') })
    closeModal()
  }

  //Закрытие и очистка формы
  function closeModal() {
    onClose()
    setForm({
      type: 'expense',
      category: '',
      amount: '',
      date: new Date(),
      description: ''
    })
    setIsCalendarOpen(false)
  }

  //Открытие календаря для выбора даты
  function openCalendar() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: form.date,
        mode: 'date',
        display: 'calendar',
        onValueChange: (_, date) => changeForm({ date })
      })
    }
    else {
      setIsCalendarOpen(prev => !prev)
    }
  }

  return (
    <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={closeModal}>
      <View style={styles.container}>
        <BlurView
          blurTarget={blurTarget}
          blurMethod="dimezisBlurView"
          intensity={25}
          tint="dark"
          onTouchEnd={closeModal}
          style={styles.backdrop}
        />
        <SafeAreaView style={styles.wrapper} pointerEvents="box-none">
          <View style={styles.modal}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <Text style={styles.title}>Новая операция</Text>
                <Pressable onPress={closeModal} style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}>
                  <Image source={Close} style={styles.closeIcon} tintColor={styles.closeIcon.tintColor} />
                </Pressable>
              </View>
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
                    onChange={item => changeForm({ category: item.name })}
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
                      if (event.target.value) changeForm({ date: new Date(`${event.target.value}T00:00:00`) })
                    }}
                  />
                )}
                {Platform.OS !== 'web' && (
                  <Pressable onPress={openCalendar} style={({ pressed }) => [styles.dateButton, pressed && styles.buttonPressed]}>
                    <Text style={styles.dateText}>{form.date.toLocaleDateString('ru-RU')}</Text>
                  </Pressable>
                )}
                {Platform.OS === 'ios' && isCalendarOpen && (
                  <DateTimePicker
                    value={form.date}
                    mode="date"
                    display="inline"
                    onValueChange={(_, date) => changeForm({ date })}
                  />
                )}
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Описание</Text>
                <TextInput
                  style={[styles.input, styles.description]}
                  value={form.description}
                  onChangeText={description => changeForm({ description })}
                  placeholder="На что потратили или откуда получили"
                  placeholderTextColor={styles.placeholder.color}
                  multiline
                />
              </View>
              <View style={styles.actions}>
                <Pressable onPress={closeModal} style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.buttonPressed]}>
                  <Text style={[styles.buttonText, styles.cancelText]}>Отмена</Text>
                </Pressable>
                <Pressable onPress={saveOperation} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
                  <Text style={styles.buttonText}>Сохранить</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}
