import { ArrowDown } from '@/assets/icons'
import { categories } from '@/constants/categories'
import DateField from '@/components/DateField'
import { Image } from 'expo-image'
import { Pressable, Text, TextInput, View } from 'react-native'
import { Dropdown } from 'react-native-element-dropdown'
import type { OperationForm, OperationModalStyles } from '.'

type OperationFormContentProps = {
  styles: OperationModalStyles
  form: OperationForm
  balance: number
  isSaving: boolean
  onChangeForm: (data: Partial<OperationForm>) => void
  onSave: () => void
  onClose: () => void
}

export function OperationFormContent({ styles, form, balance, isSaving, onChangeForm, onSave, onClose }: OperationFormContentProps) {
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

    const pattern = form.type === 'adjustment'
      ? /^-?(\d+([.,]\d*)?)?$/
      : /^(\d+([.,]\d*)?)?$/

    if (pattern.test(value)) {
      onChangeForm({ amount: value })
    }
  }

  return (
    <>
      <View style={styles.types}>
        <View style={styles.typesRow}>
          <Pressable disabled={isSaving} onPress={() => changeType('income')} style={({ pressed }) => [styles.typeButton, styles.typeHalf, form.type === 'income' && styles.typeSelected, pressed && styles.buttonPressed]}>
            <Text style={[styles.typeText, form.type === 'income' && styles.typeSelectedText]}>Доход</Text>
          </Pressable>
          <Pressable disabled={isSaving} onPress={() => changeType('expense')} style={({ pressed }) => [styles.typeButton, styles.typeHalf, form.type === 'expense' && styles.typeSelected, pressed && styles.buttonPressed]}>
            <Text style={[styles.typeText, form.type === 'expense' && styles.typeSelectedText]}>Расход</Text>
          </Pressable>
        </View>
        <Pressable disabled={isSaving} onPress={() => changeType('adjustment')} style={({ pressed }) => [styles.typeButton, form.type === 'adjustment' && styles.typeSelected, pressed && styles.buttonPressed]}>
          <Text style={[styles.typeText, form.type === 'adjustment' && styles.typeSelectedText]}>Изменить баланс</Text>
        </Pressable>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>{form.type === 'adjustment' ? 'Новый баланс' : 'Сумма'}</Text>
        <TextInput
          style={styles.input}
          editable={!isSaving}
          value={form.amount}
          onChangeText={changeAmount}
          keyboardType={'decimal-pad'}
          placeholder="0 ₽"
          placeholderTextColor={styles.placeholder.color}
        />
      </View>
      {form.type !== 'adjustment' && (
        <View style={styles.field}>
          <Text style={styles.label}>Категория</Text>
          <Dropdown
            disable={isSaving}
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
        <DateField disabled={isSaving} value={form.date} onChange={date => onChangeForm({ date })} />
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Описание</Text>
        <TextInput
          style={[styles.input, styles.description]}
          editable={!isSaving}
          value={form.description}
          onChangeText={description => onChangeForm({ description })}
          placeholder="На что потратили или откуда получили"
          placeholderTextColor={styles.placeholder.color}
          multiline
        />
      </View>
      <View style={styles.actions}>
        <Pressable disabled={isSaving} onPress={onClose} style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.buttonPressed]}>
          <Text style={[styles.buttonText, styles.cancelText]}>Отмена</Text>
        </Pressable>
        <Pressable disabled={isSaving} onPress={onSave} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Сохранить</Text>
        </Pressable>
      </View>
    </>
  )
}
