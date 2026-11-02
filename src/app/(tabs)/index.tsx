import { Filter, Plus } from '@/assets/icons'
import { OperationCard, type Operation } from '@/components/OperationCard'
import OperationModal from '@/components/OperationModal'
import { BlurTargetView } from 'expo-blur'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useStyles } from '@/hooks/useStyles'
import { useRef, useState } from 'react'
import { FlatList, Pressable, Text, View, type ViewInstance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const operations: Operation[] = [
  { id: '1', type: 'expense', amount: 125000, category: 'Продукты', date: '2026-11-02', description: 'Покупки на неделю' },
  { id: '2', type: 'expense', amount: 35000, category: 'Транспорт', date: '2026-11-02', description: 'Поездка на такси' },
  { id: '3', type: 'income', amount: 4500000, category: 'Зарплата', date: '2026-11-01', description: 'Зарплата за октябрь' },
  { id: '4', type: 'expense', amount: 90000, category: 'Подписки', date: '2026-11-01', description: 'Музыка и кино' },
  { id: '5', type: 'expense', amount: 600000, category: 'Жильё', date: '2026-10-31', description: 'Коммунальные платежи' },
  { id: '6', type: 'expense', amount: 400000, category: 'Развлечения', date: '2026-10-30', description: 'Выходные с друзьями' }
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

  const [modalOpen, setModalOpen] = useState(false)
  const blurTargetRef = useRef<ViewInstance | null>(null)

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
                      <Text style={styles.balanceAmount}>32 500 ₽</Text>
                    </View>
                    <View style={styles.balanceTotals}>
                      <View style={styles.balanceTotal}>
                        <Text style={styles.balanceLabel}>Доходы</Text>
                        <Text style={styles.balanceTotalAmount}>45 000 ₽</Text>
                      </View>
                      <View style={styles.balanceTotal}>
                        <Text style={styles.balanceLabel}>Расходы</Text>
                        <Text style={styles.balanceTotalAmount}>12 500 ₽</Text>
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
      {modalOpen && (
        <OperationModal blurTarget={blurTargetRef} onClose={() => setModalOpen(false)} />
      )}
    </>
  )
}
