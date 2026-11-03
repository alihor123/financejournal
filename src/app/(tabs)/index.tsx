import { OperationsContext } from '@/context/OperationsContext'
import { Download, Filter, Plus } from '@/assets/icons'
import { OperationCard, type Operation } from '@/components/OperationCard'
import OperationModal, { type ModalOpen, type OperationForm } from '@/components/OperationModal/index'
import { BlurTargetView } from 'expo-blur'
import { randomUUID } from 'expo-crypto'
import { Image } from 'expo-image'
import { File, Paths } from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import Filters, { type FilterForm } from '@/components/Filters'
import { useStyles } from '@/hooks/useStyles'
import { getJournal, getOperations, insertOperation, updateOperation, removeOperation, getOperationsForExport, pageSize } from '@/db/operations'
import { createCsv, showMessage } from '@/helpers'
import { useContext, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, FlatList, Pressable, Text, View, type ViewInstance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

function getEmptyForm(): OperationForm {
  return { type: 'expense', category: '', amount: '', date: new Date(), description: '' }
}

function getEmptyFilters(): FilterForm {
  return { dateFrom: null, dateTo: null, category: '' }
}

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
      paddingBottom: 0,
      gap: 20
    },
    header: {
      position: 'relative',
      zIndex: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    },
    filtersBackdrop: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 5
    },
    headerActions: {
      flexDirection: 'row',
      gap: 4
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
      flexGrow: 1,
      gap: 12,
      paddingBottom: 80
    },
    empty: {
      flex: 1,
      padding: 24,
      alignItems: 'center',
      justifyContent: 'center'
    },
    retryButton: {
      marginTop: 16,
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: colors.surfaceSoft
    },
    retryText: {
      fontWeight: '600',
      color: colors.onSurfaceSoft
    },
    loader: {
      color: colors.primary
    },
    emptyText: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.textSecondary
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

  const { updateOperationsVersion } = useContext(OperationsContext)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [operations, setOperations] = useState<Operation[]>([])
  const [modalOpen, setModalOpen] = useState<ModalOpen>(null)
  const [form, setForm] = useState<OperationForm>(getEmptyForm)
  const [filterForm, setFilterForm] = useState<FilterForm>(getEmptyFilters)
  const [filters, setFilters] = useState<FilterForm>(getEmptyFilters)
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0, count: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadError, setIsLoadError] = useState(false)
  const [isNextPageLoading, setIsNextPageLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const offsetRef = useRef(0)
  const requestRef = useRef(0)
  const loadingRef = useRef(false)
  const savingRef = useRef(false)
  const exportingRef = useRef(false)
  const blurTargetRef = useRef<ViewInstance | null>(null)

  //Загрузка первой страницы и итогов по всему журналу
  async function loadOperations(selectedFilters: FilterForm) {
    const request = ++requestRef.current
    loadingRef.current = true
    offsetRef.current = 0
    setIsLoading(true)
    setIsLoadError(false)
    setIsNextPageLoading(false)

    try {
      const data = await getJournal(selectedFilters)
      if (request !== requestRef.current) return

      setOperations(data.operations)
      setTotals(data.totals)
      offsetRef.current = data.operations.length
      setHasMore(data.operations.length === pageSize)
    }
    catch {
      if (request === requestRef.current) setIsLoadError(true)
    }
    finally {
      if (request === requestRef.current) {
        loadingRef.current = false
        setIsLoading(false)
      }
    }
  }

  //Догрузка следующей страницы без повторного запроса при прокрутке
  async function loadNextPage() {
    if (loadingRef.current || savingRef.current || isLoadError || !hasMore) return

    const request = requestRef.current
    loadingRef.current = true
    setIsNextPageLoading(true)

    try {
      const data = await getOperations(filters, offsetRef.current)
      if (request !== requestRef.current) return

      setOperations(prev => [...prev, ...data])
      offsetRef.current += data.length
      setHasMore(data.length === pageSize)
    }
    catch {
      if (request === requestRef.current) showMessage('Не удалось загрузить следующие операции')
    }
    finally {
      if (request === requestRef.current) {
        loadingRef.current = false
        setIsNextPageLoading(false)
      }
    }
  }

  useEffect(() => {
    loadOperations(filters)

    return () => {
      requestRef.current += 1
    }
  }, [filters])

  //Открытие формы с применёнными фильтрами
  function openFilters() {
    setFilterForm(filters)
    setIsFiltersOpen(prev => !prev)
  }

  //Изменение полей фильтра и границ периода
  function changeFilterForm(data: Partial<FilterForm>) {
    setFilterForm(prev => {
      const newForm = { ...prev, ...data }

      if (data.dateFrom && (!newForm.dateTo || newForm.dateTo < data.dateFrom)) {
        newForm.dateTo = data.dateFrom
      }

      return newForm
    })
  }

  //Применение фильтров к списку операций
  function applyFilters() {
    setFilters(filterForm)
    setIsFiltersOpen(false)
  }

  //Сброс формы и отображение всех операций
  function resetFilters() {
    setFilterForm(getEmptyFilters())
    setFilters(getEmptyFilters())
  }

  //Открытие пустой формы новой операции
  function openCreateModal() {
    setForm(getEmptyForm())
    setModalOpen({ type: 'create' })
  }

  //Открытие формы с данными выбранной операции
  function openEditModal(operation: Operation) {
    const amount = operation.type === 'adjustment' ? operation.targetBalance : operation.amount

    setForm({
      type: operation.type,
      category: operation.category,
      amount: amount === null || amount === undefined ? '' : String(amount / 100),
      date: operation.date,
      description: operation.description
    })
    setModalOpen({ type: 'edit', operation })
  }

  //Открытие подтверждения удаления выбранной операции
  function openDeleteModal(operation: Operation) {
    setModalOpen({ type: 'delete', operation })
  }

  //Изменение полей общей формы
  function changeForm(data: Partial<OperationForm>) {
    setForm(prev => ({ ...prev, ...data }))
  }

  //Закрытие модалки и очистка формы
  function closeModal() {
    setModalOpen(null)
    setForm(getEmptyForm())
  }

  //Экспорт всех подходящих операций через системное меню отправки файла
  async function exportOperations() {
    if (exportingRef.current) return
    exportingRef.current = true
    setIsExporting(true)

    try {
      if (!await Sharing.isAvailableAsync()) {
        showMessage('Отправка файлов недоступна')
        return
      }

      const data = await getOperationsForExport(filters)
      if (data.length === 0) {
        showMessage('Нет операций для экспорта')
        return
      }

      const file = new File(Paths.cache, `financejournal-${Date.now()}.csv`)
      file.create()
      await file.write(createCsv(data))
      await Sharing.shareAsync(file.uri, { mimeType: 'text/csv', UTI: 'public.comma-separated-values-text', dialogTitle: 'Экспорт журнала' })
    }
    catch {
      showMessage('Не удалось экспортировать журнал. Попробуйте позже')
    }
    finally {
      exportingRef.current = false
      setIsExporting(false)
    }
  }

  //Сохранение новой операции и обновление первой страницы
  async function createOperation(data: Omit<Operation, 'id'>) {
    if (savingRef.current) return
    savingRef.current = true
    setIsSaving(true)

    try {
      await insertOperation({ ...data, id: randomUUID() })
      updateOperationsVersion()
      closeModal()
      await loadOperations(filters)
    }
    catch {
      showMessage('Не удалось сохранить операцию. Попробуйте позже')
    }
    finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  //Сохранение изменений в БД и обновление журнала
  async function editOperation(data: Omit<Operation, 'id'>) {
    if (savingRef.current || modalOpen?.type !== 'edit') return
    savingRef.current = true
    setIsSaving(true)

    try {
      await updateOperation({ ...data, id: modalOpen.operation.id })
      updateOperationsVersion()
      closeModal()
      await loadOperations(filters)
    }
    catch {
      showMessage('Не удалось изменить операцию. Попробуйте позже')
    }
    finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  //Удаление из БД и обновление списка с итогами
  async function deleteOperation() {
    if (savingRef.current || modalOpen?.type !== 'delete') return
    savingRef.current = true
    setIsSaving(true)

    try {
      await removeOperation(modalOpen.operation.id)
      updateOperationsVersion()
      closeModal()
      await loadOperations(filters)
    }
    catch {
      showMessage('Не удалось удалить операцию. Попробуйте позже')
    }
    finally {
      savingRef.current = false
      setIsSaving(false)
    }
  }

  return (
    <>
      <BlurTargetView ref={blurTargetRef} style={styles.container}>
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <View style={styles.content}>
            {isFiltersOpen && <Pressable style={styles.filtersBackdrop} onPress={() => setIsFiltersOpen(false)} />}
            <View style={styles.header}>
              <Text style={styles.title}>Журнал</Text>
              <View style={styles.headerActions}>
                <Pressable
                  onPress={exportOperations}
                  disabled={isLoading || isLoadError || isSaving || isExporting}
                  style={({ pressed }) => [styles.filterButton, pressed && styles.buttonPressed]}
                >
                  <Image source={Download} style={styles.filterIcon} tintColor={styles.filterIcon.tintColor} />
                </Pressable>
                <Pressable
                  onPress={openFilters}
                  disabled={isSaving}
                  style={({ pressed }) => [styles.filterButton, pressed && styles.buttonPressed]}
                >
                  <Image source={Filter} style={styles.filterIcon} tintColor={styles.filterIcon.tintColor} />
                </Pressable>
              </View>
              <Filters
                isOpen={isFiltersOpen}
                form={filterForm}
                onChangeForm={changeFilterForm}
                onApply={applyFilters}
                onReset={resetFilters}
              />
            </View>
            {(isLoading || isLoadError) && (
              <View style={styles.empty}>
                {isLoading && <ActivityIndicator size="large" color={styles.loader.color} />}
                {!isLoading && isLoadError && (
                  <>
                    <Text style={styles.emptyText}>Не удалось загрузить операции</Text>
                    <Pressable onPress={() => loadOperations(filters)} style={({ pressed }) => [styles.retryButton, pressed && styles.buttonPressed]}>
                      <Text style={styles.retryText}>Повторить</Text>
                    </Pressable>
                  </>
                )}
              </View>
            )}
            {!isLoading && !isLoadError && <FlatList
              data={operations}
              keyExtractor={item => item.id}
              onEndReached={loadNextPage}
              onEndReachedThreshold={0.3}
              ListFooterComponent={<View>{isNextPageLoading && <ActivityIndicator size="large" color={styles.loader.color} />}</View>}
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
              ListEmptyComponent={
                <View style={styles.empty}>
                  {totals.count === 0 && <Text style={styles.emptyText}>Операций пока нет</Text>}
                  {totals.count > 0 && <Text style={styles.emptyText}>Ничего не найдено</Text>}
                </View>
              }
              renderItem={({ item }) => <OperationCard operation={item} onEdit={() => openEditModal(item)} onDelete={() => openDeleteModal(item)} disabled={isSaving} />}
            />}
            <Pressable disabled={isLoading || isLoadError || isSaving} onPress={openCreateModal} style={({ pressed }) => [styles.addButton, pressed && styles.buttonPressed]}>
              <Image source={Plus} style={styles.addIcon} tintColor={styles.addIcon.tintColor} />
            </Pressable>
          </View>
        </SafeAreaView>
      </BlurTargetView>
      <OperationModal
        modalOpen={modalOpen}
        isSaving={isSaving}
        form={form}
        balance={totals.balance}
        blurTarget={blurTargetRef}
        onChangeForm={changeForm}
        onCreate={createOperation}
        onEdit={editOperation}
        onDelete={deleteOperation}
        onClose={closeModal}
      />
    </>
  )
}
