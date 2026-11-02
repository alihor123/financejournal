import { Filter, Pencil, Plus, Trash } from '@/assets/icons'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { useStyles } from '@/hooks/useStyles'
import { Pressable, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

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
      gap: 12
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text
    },
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

  return (
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
        <View style={styles.operations}>
          <Text style={styles.sectionTitle}>Последние операции</Text>
          <View style={styles.operation}>
            <View style={styles.operationHeader}>
              <Text style={styles.operationCategory}>Продукты</Text>
              <Text style={styles.operationAmount}>-1 250 ₽</Text>
            </View>
            <Text style={styles.operationDescription}>Покупки на неделю</Text>
            <View style={styles.operationFooter}>
              <Text style={styles.operationDate}>2 ноября 2026</Text>
              <View style={styles.operationActions}>
                <Pressable style={({ pressed }) => [styles.operationButton, pressed && styles.buttonPressed]}>
                  <Image source={Pencil} style={styles.operationIcon} tintColor={styles.operationIcon.tintColor} />
                </Pressable>
                <Pressable style={({ pressed }) => [styles.operationButton, pressed && styles.buttonPressed]}>
                  <Image source={Trash} style={styles.operationIcon} tintColor={styles.operationIcon.tintColor} />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
        <Pressable style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
          <Image source={Plus} style={styles.addIcon} tintColor={styles.addIcon.tintColor} />
        </Pressable>
      </View>
    </SafeAreaView>
  )
}
