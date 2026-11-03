import { ArrowDown } from '@/assets/icons'
import { useStyles } from '@/hooks/useStyles'
import { Image } from 'expo-image'
import { ScrollView, Text, View, useWindowDimensions } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'

const days = [
  { day: '1', income: 0, expense: 1200 },
  { day: '2', income: 12000, expense: 650 },
  { day: '3', income: 0, expense: 1800 },
  { day: '4', income: 4500, expense: 0 },
  { day: '5', income: 0, expense: 950 },
  { day: '6', income: 8000, expense: 2400 },
  { day: '7', income: 0, expense: 1500 }
]

const categories = [
  { name: 'Продукты', amount: 4250 },
  { name: 'Транспорт', amount: 1700 },
  { name: 'Подписки', amount: 1275 },
  { name: 'Развлечения', amount: 1275 }
]

export default function StatisticsScreen() {
  const styles = useStyles(colors => ({
    container: {
      flex: 1,
      backgroundColor: colors.background
    },
    content: {
      flex: 1,
      width: '100%',
      maxWidth: 600,
      alignSelf: 'center',
      paddingTop: 24
    },
    header: {
      paddingHorizontal: 24,
      paddingBottom: 20
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.text
    },
    scroll: {
      flex: 1
    },
    scrollContent: {
      paddingHorizontal: 24,
      paddingBottom: 24,
      gap: 20
    },
    period: {
      gap: 10
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text
    },
    row: {
      flexDirection: 'row',
      gap: 12
    },
    dateField: {
      flex: 1,
      gap: 8
    },
    label: {
      fontSize: 13,
      color: colors.textSecondary
    },
    dateButton: {
      minHeight: 46,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: colors.surfacePressed,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6
    },
    dateText: {
      fontSize: 14,
      color: colors.text
    },
    arrow: {
      width: 16,
      height: 16,
      tintColor: colors.textSecondary
    },
    total: {
      flex: 1,
      borderRadius: 20,
      padding: 16,
      gap: 10,
      backgroundColor: colors.balanceSurface
    },
    totalAmount: {
      fontSize: 23,
      fontWeight: '700'
    },
    income: {
      color: colors.income
    },
    expense: {
      color: colors.expense
    },
    chartCard: {
      padding: 16,
      gap: 18,
      borderRadius: 24,
      backgroundColor: colors.surfacePressed,
      overflow: 'hidden'
    },
    chartHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    },
    legend: {
      flexDirection: 'row',
      gap: 20
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 7
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4
    },
    incomeDot: {
      backgroundColor: colors.income
    },
    expenseDot: {
      backgroundColor: colors.expense
    },
    chartText: {
      fontSize: 11,
      color: colors.textSecondary
    },
    chartRules: {
      color: colors.border
    },
    categories: {
      gap: 18
    },
    category: {
      gap: 10
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    },
    categoryName: {
      flex: 1,
      fontSize: 15,
      color: colors.text
    },
    categoryAmount: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text
    },
    track: {
      height: 7,
      borderRadius: 4,
      backgroundColor: colors.surfacePressed,
      overflow: 'hidden'
    },
    progress: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: colors.primary
    },
    categoryFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  }))

  const { width } = useWindowDimensions()
  const income = days.reduce((result, day) => result + day.income, 0)
  const expense = days.reduce((result, day) => result + day.expense, 0)
  const chartData = days.flatMap(day => [
    { value: day.income, label: day.day, frontColor: styles.income.color, spacing: 3 },
    { value: day.expense, frontColor: styles.expense.color }
  ])

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Статистика</Text>
        </View>
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.period}>
            <Text style={styles.sectionTitle}>Период</Text>
            <View style={styles.row}>
              <View style={styles.dateField}>
                <Text style={styles.label}>От</Text>
                <View style={styles.dateButton}>
                  <Text style={styles.dateText}>01.11.2026</Text>
                  <Image source={ArrowDown} style={styles.arrow} tintColor={styles.arrow.tintColor} />
                </View>
              </View>
              <View style={styles.dateField}>
                <Text style={styles.label}>До</Text>
                <View style={styles.dateButton}>
                  <Text style={styles.dateText}>07.11.2026</Text>
                  <Image source={ArrowDown} style={styles.arrow} tintColor={styles.arrow.tintColor} />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.total}>
              <Text style={styles.label}>Доходы</Text>
              <Text style={[styles.totalAmount, styles.income]}>{income.toLocaleString('ru-RU')} ₽</Text>
            </View>
            <View style={styles.total}>
              <Text style={styles.label}>Расходы</Text>
              <Text style={[styles.totalAmount, styles.expense]}>{expense.toLocaleString('ru-RU')} ₽</Text>
            </View>
          </View>
          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.sectionTitle}>По дням</Text>
              <Text style={styles.label}>Ноябрь · ₽</Text>
            </View>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.dot, styles.incomeDot]} />
                <Text style={styles.label}>Доходы</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.dot, styles.expenseDot]} />
                <Text style={styles.label}>Расходы</Text>
              </View>
            </View>
            <BarChart
              data={chartData}
              width={Math.min(width, 600) - 116}
              height={190}
              barWidth={10}
              spacing={12}
              initialSpacing={10}
              endSpacing={10}
              barBorderTopLeftRadius={4}
              barBorderTopRightRadius={4}
              maxValue={12000}
              noOfSections={4}
              yAxisLabelWidth={36}
              yAxisThickness={0}
              xAxisThickness={0}
              yAxisTextStyle={styles.chartText}
              xAxisLabelTextStyle={styles.chartText}
              rulesColor={styles.chartRules.color}
              rulesType="dashed"
              formatYLabel={label => Number(label) === 0 ? '0' : `${Number(label) / 1000}к`}
              showScrollIndicator={false}
            />
          </View>
          <View style={styles.categories}>
            <Text style={styles.sectionTitle}>Расходы по категориям</Text>
            {categories.map(category => {
              const percent = Math.round(category.amount / expense * 100)

              return (
                <View key={category.name} style={styles.category}>
                  <View style={styles.categoryHeader}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryAmount}>{category.amount.toLocaleString('ru-RU')} ₽</Text>
                  </View>
                  <View style={styles.track}>
                    <View style={[styles.progress, { width: `${percent}%` }]} />
                  </View>
                  <View style={styles.categoryFooter}>
                    <Text style={styles.label}>От всех расходов</Text>
                    <Text style={styles.label}>{percent}%</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
