import DateField from '@/components/DateField'
import { getStatistics, getDailyStatistics, getCategoryStatistics, type StatisticsPeriod, type StatisticsData } from '@/db/statistics'
import { dateFormating, dateToString } from '@/helpers'
import { OperationsContext } from '@/context/OperationsContext'
import { useContext, useEffect, useRef, useState } from 'react'
import { useStyles } from '@/hooks/useStyles'
import { ActivityIndicator, Pressable, ScrollView, Text, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native'
import { BarChart } from 'react-native-gifted-charts'
import { SafeAreaView } from 'react-native-safe-area-context'

//Начальный период статистики — текущий месяц
function getDefaultPeriod(): StatisticsPeriod {
  const today = new Date()
  return {
    dateFrom: new Date(today.getFullYear(), today.getMonth(), 1),
    dateTo: new Date(today.getFullYear(), today.getMonth() + 1, 0)
  }
}

//Короткие суммы на вертикальной оси графика
function chartAmountFormating(label: string) {
  const amount = Number(label)
  if (amount >= 1000) return `${Math.round(amount / 100) / 10}к`
  return amount.toLocaleString('ru-RU', { maximumFractionDigits: 2 })
}

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
      backgroundColor: colors.surfacePressed
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
    status: {
      minHeight: 220,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 20
    },
    statusText: {
      fontSize: 15,
      textAlign: 'center',
      color: colors.textSecondary
    },
    retryButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: colors.surfaceSoft
    },
    retryText: {
      fontWeight: '600',
      color: colors.onSurfaceSoft
    },
    pressed: {
      opacity: 0.6
    },
    loader: {
      color: colors.primary
    },
    tooltip: {
      width: 140,
      padding: 10,
      gap: 4,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface
    },
    tooltipTitle: {
      fontSize: 11,
      color: colors.textSecondary
    },
    tooltipAmount: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text
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
  const { operationsVersion } = useContext(OperationsContext)
  const [period, setPeriod] = useState<StatisticsPeriod>(getDefaultPeriod)
  const [statistics, setStatistics] = useState<StatisticsData>({ totals: { income: 0, expense: 0 }, days: [], categories: [] })
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const requestRef = useRef(0)
  const chartScrollRef = useRef(0)

  //Загрузка всех данных статистики с защитой от устаревшего периода
  async function loadStatistics(selectedPeriod: StatisticsPeriod) {
    const request = ++requestRef.current
    chartScrollRef.current = 0
    setIsLoading(true)
    setIsError(false)

    try {
      const [totals, days, categories] = await Promise.all([
        getStatistics(selectedPeriod),
        getDailyStatistics(selectedPeriod),
        getCategoryStatistics(selectedPeriod)
      ])
      if (request !== requestRef.current) return
      setStatistics({ totals, days, categories })
    }
    catch {
      if (request === requestRef.current) setIsError(true)
    }
    finally {
      if (request === requestRef.current) setIsLoading(false)
    }
  }

  //Изменение периода с сохранением правильного порядка дат
  function changePeriod(data: Partial<StatisticsPeriod>) {
    setPeriod(prev => {
      const newPeriod = { ...prev, ...data }
      if (newPeriod.dateTo < newPeriod.dateFrom) newPeriod.dateTo = newPeriod.dateFrom
      return newPeriod
    })
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadStatistics(period)

    return () => {
      requestRef.current += 1
    }
  }, [period, operationsVersion])

  const { income, expense } = statistics.totals
  const hasData = income > 0 || expense > 0
  const days = []
  const date = new Date(period.dateFrom)
  const dailyStatistics = Object.fromEntries(statistics.days.map(day => [day.date, day]))

  while (date <= period.dateTo) {
    const key = dateToString(date)
    days.push(dailyStatistics[key] || { date: key, income: 0, expense: 0 })
    date.setDate(date.getDate() + 1)
  }

  const chartData = days.flatMap(day => [
    { value: day.income / 100, label: day.date.slice(8) + '.' + day.date.slice(5, 7), labelWidth: 32, date: day.date, title: 'Доход', frontColor: styles.income.color, spacing: 3 },
    { value: day.expense / 100, date: day.date, title: 'Расход', frontColor: styles.expense.color }
  ])
  const maxValue = chartData.reduce((result, item) => Math.max(result, item.value), 1) * 1.8
  const chartWidth = Math.min(width, 600) - 116

  //Подсказка остаётся внутри видимой части прокручиваемого графика
  function renderChartTooltip(item: { date: string, title: string, value: number }, index: number) {
    const position = chartData.slice(0, index).reduce((result, bar) => result + 10 + (bar.spacing ?? 12), 20) - chartScrollRef.current
    const left = Math.max(0, Math.min(position, chartWidth - 140))

    return (
      <View style={[styles.tooltip, { transform: [{ translateX: left - position }] }]}>
        <Text style={styles.tooltipTitle}>{dateFormating(new Date(`${item.date}T00:00:00`))}</Text>
        <Text style={styles.tooltipTitle}>{item.title}</Text>
        <Text style={styles.tooltipAmount}>{item.value.toLocaleString('ru-RU')} ₽</Text>
      </View>
    )
  }

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
                <DateField value={period.dateFrom} placeholder="Дата начала" onChange={dateFrom => changePeriod({ dateFrom })} />
              </View>
              <View style={styles.dateField}>
                <Text style={styles.label}>До</Text>
                <DateField value={period.dateTo} minimumDate={period.dateFrom} placeholder="Дата конца" onChange={dateTo => changePeriod({ dateTo })} />
              </View>
            </View>
          </View>
          {(isLoading || isError) && (
            <View style={styles.status}>
              {isLoading && <ActivityIndicator size="large" color={styles.loader.color} />}
              {!isLoading && isError && (
                <>
                  <Text style={styles.statusText}>Не удалось загрузить статистику</Text>
                  <Pressable onPress={() => loadStatistics(period)} style={({ pressed }) => [styles.retryButton, pressed && styles.pressed]}>
                    <Text style={styles.retryText}>Повторить</Text>
                  </Pressable>
                </>
              )}
            </View>
          )}
          {!isLoading && !isError && (
            <>
              <View style={styles.row}>
                <View style={styles.total}>
                  <Text style={styles.label}>Доходы</Text>
                  <Text style={[styles.totalAmount, styles.income]}>{(income / 100).toLocaleString('ru-RU')} ₽</Text>
                </View>
                <View style={styles.total}>
                  <Text style={styles.label}>Расходы</Text>
                  <Text style={[styles.totalAmount, styles.expense]}>{(expense / 100).toLocaleString('ru-RU')} ₽</Text>
                </View>
              </View>
              {hasData && <View style={styles.chartCard}>
                <View style={styles.chartHeader}>
                  <Text style={styles.sectionTitle}>По дням</Text>
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
                  width={chartWidth}
                  height={190}
                  barWidth={10}
                  spacing={12}
                  initialSpacing={10}
                  endSpacing={10}
                  barBorderTopLeftRadius={4}
                  barBorderTopRightRadius={4}
                  maxValue={maxValue}
                  noOfSections={4}
                  yAxisLabelWidth={36}
                  yAxisThickness={0}
                  xAxisThickness={0}
                  yAxisTextStyle={styles.chartText}
                  xAxisLabelTextStyle={styles.chartText}
                  rulesColor={styles.chartRules.color}
                  rulesType="dashed"
                  formatYLabel={chartAmountFormating}
                  key={`${dateToString(period.dateFrom)}-${dateToString(period.dateTo)}`}
                  activeOpacity={1}
                  onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    chartScrollRef.current = event.nativeEvent.contentOffset.x
                  }}
                  renderTooltip={renderChartTooltip}
                  showScrollIndicator={false}
                />
              </View>}
              {!hasData && <View style={styles.status}><Text style={styles.statusText}>Нет данных за выбранный период</Text></View>}
              {expense > 0 && <View style={styles.categories}>
                <Text style={styles.sectionTitle}>Расходы по категориям</Text>
                {statistics.categories.map(category => {
                  const percent = Math.round(category.amount / expense * 100)

                  return (
                    <View key={category.name} style={styles.category}>
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryName}>{category.name}</Text>
                        <Text style={styles.categoryAmount}>{(category.amount / 100).toLocaleString('ru-RU')} ₽</Text>
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
              </View>}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}
