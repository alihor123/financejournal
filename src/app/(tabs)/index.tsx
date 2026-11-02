import { Filter, Plus } from '@/assets/icons'
import { OperationCard, type Operation } from '@/components/OperationCard'
import OperationModal, { type OperationForm } from '@/components/OperationModal'
import { BlurTargetView } from 'expo-blur'
import { randomUUID } from 'expo-crypto'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useStyles } from '@/hooks/useStyles'
import { useRef, useState } from 'react'
import { FlatList, Pressable, Text, View, type ViewInstance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const mockOperations: Operation[] = [
  { id: '1', type: 'expense', amount: 125000, category: 'Продукты', date: new Date(2026, 10, 2), description: 'Покупки на неделю' },
  { id: '2', type: 'expense', amount: 35000, category: 'Транспорт', date: new Date(2026, 10, 2), description: 'Поездка на такси' },
  { id: '3', type: 'income', amount: 4500000, category: 'Зарплата', date: new Date(2026, 10, 1), description: 'Зарплата за октябрь' },
  { id: '4', type: 'expense', amount: 90000, category: 'Подписки', date: new Date(2026, 10, 1), description: 'Музыка и кино' },
  { id: '5', type: 'expense', amount: 600000, category: 'Жильё', date: new Date(2026, 9, 31), description: 'Коммунальные платежи' },
  { id: '6', type: 'expense', amount: 400000, category: 'Развлечения', date: new Date(2026, 9, 30), description: 'Выходные с друзьями' }
]

export default function Index() {
  const styles = useStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
      padding: 24,
      gap: 20
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    },
    filterButton: {
      width: 44,
      height: 44,
      alignItems: 'center',
      justifyContent: 'center'
    },
    filterIcon: {
      width: 24,
      height: 24,
      tintColor: colors.primary
    },
    buttonPressed: {
      opacity: 0.6
    },
    balanceCard: {
      padding: 20,
      borderRadius: 24,
      backgroundColor: colors.balanceSurface,
      gap: 20
    },
    balanceLabel: {
      fontSize: 14,
      color: colors.textSecondary
    },
    balanceAmount: {
      fontSize: 36,
      lineHeight: 44,
      fontWeight: '700',
      color: colors.text
    },
    balanceTotals: {
      flexDirection: 'row',
      gap: 12
    },
    balanceTotal: {
      flex: 1,
      padding: 12,
      borderRadius: 16,
      backgroundColor: colors.balanceSurface,
      gap: 6
    },
    balanceTotalAmount: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text
    },
    operations: {
      flex: 1
    },
    operationsHeader: {
      gap: 20
    },
    operationsContent: {
      gap: 12,
      paddingBottom: 80
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text
    },
    addButton: {
      position: 'absolute',
      right: 24,
      bottom: 24,
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary
    },
    addIcon: {
      width: 28,
      height: 28,
      tintColor: colors.onPrimary
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.text
    }
  }))

  const [operations, setOperations] = useState<Operation[]>(mockOperations)
  const [modalOpen, setModalOpen] = useState(false)
  const blurTargetRef = useRef<ViewInstance | null>(null)

  const totals = operations.reduce((result, operation) => {
    if (operation.type === 'income') {
      result.income += operation.amount
      result.balance += operation.amount
    }

    if (operation.type === 'expense') {
      result.expense += operation.amount
      result.balance -= operation.amount
    }

    if (operation.type === 'adjustment') {
      result.balance += operation.amount
    }

    return result
  }, { income: 0, expense: 0, balance: 0 })

  //Добавление операции в журнал
  function createOperation(data: OperationForm) {
    const amount = Math.round((Number(data.amount.replace(',', '.')) + Number.EPSILON) * 100)
    const operation: Operation = {
      id: randomUUID(),
      type: data.type,
      amount,
      category: data.category,
      date: data.date,
      description: data.description.trim()
    }

    if (data.type === 'adjustment') {
      operation.amount = amount - totals.balance
      operation.category = 'Изменение баланса'
    }

    setOperations(prev => [operation, ...prev])
  }

  return (
    <>
      <BlurTargetView ref={blurTargetRef} style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Журнал</Text>
              <Pressable
                onPress={() => router.push('/filters')}
                style={({ pressed }) => [styles.filterButton, pressed && styles.buttonPressed]}
              >
                <Image source={Filter} style={styles.filterIcon} tintColor={styles.filterIcon.tintColor} />
              </Pressable>
            </View>
            <FlatList
              data={operations}
              keyExtractor={item => item.id}
              style={styles.operations}
              contentContainerStyle={styles.operationsContent}
              ListHeaderComponent={
                <View style={styles.operationsHeader}>
                  <View style={styles.balanceCard}>
                    <View>
                      <Text style={styles.balanceLabel}>Текущий баланс</Text>
                      <Text style={styles.balanceAmount}>{(totals.balance / 100).toLocaleString('ru-RU')} ₽</Text>
                    </View>
                    <View style={styles.balanceTotals}>
                      <View style={styles.balanceTotal}>
                        <Text style={styles.balanceLabel}>Доходы</Text>
                        <Text style={styles.balanceTotalAmount}>{(totals.income / 100).toLocaleString('ru-RU')} ₽</Text>
                      </View>
                      <View style={styles.balanceTotal}>
                        <Text style={styles.balanceLabel}>Расходы</Text>
                        <Text style={styles.balanceTotalAmount}>{(totals.expense / 100).toLocaleString('ru-RU')} ₽</Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.sectionTitle}>Последние операции</Text>
                </View>
              }
              renderItem={({ item }) => <OperationCard operation={item} />}
            />
            <Pressable onPress={() => setModalOpen(true)} style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
              <Image source={Plus} style={styles.addIcon} tintColor={styles.addIcon.tintColor} />
            </Pressable>
          </View>
        </SafeAreaView>
      </BlurTargetView>
      <OperationModal modalOpen={modalOpen} balance={totals.balance} blurTarget={blurTargetRef} onSave={createOperation} onClose={() => setModalOpen(false)} />
    </>
  )
}
