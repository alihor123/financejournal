import { ArrowDown } from '@/assets/icons'
import { categories } from '@/constants/categories'
import DateField from '@/components/DateField'
import { useStyles } from '@/hooks/useStyles'
import { Image } from 'expo-image'
import { Dropdown } from 'react-native-element-dropdown'
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native'

export type FilterForm = {
  dateFrom: Date | null
  dateTo: Date | null
  category: string
}

type FiltersProps = {
  isOpen: boolean
  form: FilterForm
  onChangeForm: (data: Partial<FilterForm>) => void
  onApply: () => void
  onReset: () => void
}

export default function Filters({ isOpen, form, onChangeForm, onApply, onReset }: FiltersProps) {
  const styles = useStyles(colors => ({
    container: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 12,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      elevation: 6,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12
    },
    content: {
      padding: 20,
      gap: 18
    },
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text
    },
    field: {
      gap: 8
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary
    },
    row: {
      flexDirection: 'row',
      gap: 10
    },
    dateField: {
      flex: 1,
      gap: 8
    },
    selector: {
      minHeight: 46,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: colors.surfacePressed,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    categoryList: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 16
    },
    selected: {
      backgroundColor: colors.surfaceSoft
    },
    text: {
      fontSize: 15,
      color: colors.text
    },
    arrow: {
      width: 18,
      height: 18,
      tintColor: colors.textSecondary
    },
    button: {
      flex: 1,
      minHeight: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceSoft
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.onSurfaceSoft
    },
    applyButton: {
      backgroundColor: colors.primary
    },
    applyText: {
      color: colors.onPrimary
    },
    pressed: {
      opacity: 0.6
    }
  }))

  const { height } = useWindowDimensions()

  if (!isOpen) return null

  return (
    <View style={styles.container}>
      <ScrollView style={{ maxHeight: height * 0.65 }} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" nestedScrollEnabled>
        <Text style={styles.title}>Фильтр</Text>
        <View style={styles.row}>
          <View style={styles.dateField}>
            <Text style={styles.label}>От</Text>
            <DateField value={form.dateFrom} placeholder="Дата начала" onChange={dateFrom => onChangeForm({ dateFrom })} />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.label}>До</Text>
            <DateField value={form.dateTo} minimumDate={form.dateFrom || undefined} placeholder="Дата конца" onChange={dateTo => onChangeForm({ dateTo })} />
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Категория</Text>
          <Dropdown
            style={styles.selector}
            containerStyle={styles.categoryList}
            selectedTextStyle={styles.text}
            itemTextStyle={styles.text}
            activeColor={styles.selected.backgroundColor}
            data={[{ name: 'Все категории', value: '' }, ...categories.map(category => ({ name: category.name, value: category.name })), { name: 'Изменение баланса', value: 'Изменение баланса' }]}
            labelField="name"
            valueField="value"
            value={form.category}
            maxHeight={220}
            autoScroll={false}
            onChange={item => onChangeForm({ category: item.value })}
            renderRightIcon={() => <Image source={ArrowDown} style={styles.arrow} tintColor={styles.arrow.tintColor} />}
          />
        </View>
        <View style={styles.row}>
          <Pressable onPress={onReset} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
            <Text style={styles.buttonText}>Сбросить</Text>
          </Pressable>
          <Pressable onPress={onApply} style={({ pressed }) => [styles.button, styles.applyButton, pressed && styles.pressed]}>
            <Text style={[styles.buttonText, styles.applyText]}>Применить</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  )
}
