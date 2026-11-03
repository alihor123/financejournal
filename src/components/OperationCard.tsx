import { Pencil, Trash } from '@/assets/icons'
import { dateFormating } from '@/helpers'
import { useStyles } from '@/hooks/useStyles'
import { Image } from 'expo-image'
import { Pressable, Text, View } from 'react-native'

export type Operation = {
  id: string
  type: 'income' | 'expense' | 'adjustment'
  amount: number
  targetBalance?: number | null
  category: string
  date: Date
  description: string
}

type OperationCardProps = {
  operation: Operation
  disabled?: boolean
  onEdit: () => void
  onDelete: () => void
}

//Форматирование суммы операции со знаком
function amountFormating(operation: Operation) {
  if (operation.amount === 0) return '0 ₽'

  const sign = operation.type === 'expense' || operation.amount < 0 ? '-' : '+'
  const amount = (Math.abs(operation.amount) / 100).toLocaleString('ru-RU')

  return `${sign}${amount} ₽`
}

export function OperationCard({ operation, onEdit, onDelete, disabled }: OperationCardProps) {
  const styles = useStyles((colors) => ({
    operation: {
      padding: 16,
      borderRadius: 20,
      backgroundColor: colors.surfacePressed,
      gap: 10
    },
    operationHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12
    },
    operationCategory: {
      flex: 1,
      fontSize: 16,
      fontWeight: '600',
      color: colors.text
    },
    operationAmount: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.error
    },
    operationDescription: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.textSecondary
    },
    operationFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    },
    operationDate: {
      flex: 1,
      fontSize: 12,
      color: colors.textSecondary
    },
    operationActions: {
      flexDirection: 'row',
      gap: 10
    },
    operationButton: {
      width: 36,
      height: 36,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
      justifyContent: 'center'
    },
    operationIcon: {
      width: 18,
      height: 18,
      tintColor: colors.textSecondary
    },
    operationIncome: {
      color: colors.income
    },
    operationAdjustment: {
      color: colors.textSecondary
    },
    buttonPressed: {
      opacity: 0.6
    }
  }))

  return (
    <View style={styles.operation}>
      <View style={styles.operationHeader}>
        <Text style={styles.operationCategory}>{operation.category}</Text>
        <Text style={[styles.operationAmount, operation.type === 'income' && styles.operationIncome, operation.type === 'adjustment' && styles.operationAdjustment]}>
          {amountFormating(operation)}
        </Text>
      </View>
      {operation.description && <Text style={styles.operationDescription}>{operation.description}</Text>}
      <View style={styles.operationFooter}>
        <Text style={styles.operationDate}>{dateFormating(operation.date)}</Text>
        <View style={styles.operationActions}>
          <Pressable disabled={disabled} onPress={onEdit} style={({ pressed }) => [styles.operationButton, pressed && styles.buttonPressed]}>
            <Image source={Pencil} style={styles.operationIcon} tintColor={styles.operationIcon.tintColor} />
          </Pressable>
          <Pressable disabled={disabled} onPress={onDelete} style={({ pressed }) => [styles.operationButton, pressed && styles.buttonPressed]}>
            <Image source={Trash} style={styles.operationIcon} tintColor={styles.operationIcon.tintColor} />
          </Pressable>
        </View>
      </View>
    </View>
  )
}
