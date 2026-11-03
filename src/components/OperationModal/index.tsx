import { Close } from '@/assets/icons'
import type { Operation } from '@/components/OperationCard'
import { showMessage } from '@/helpers'
import { useStyles } from '@/hooks/useStyles'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import { type RefObject } from 'react'
import { Modal, Pressable, ScrollView, Text, View, type TextStyle, type ViewInstance, type ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OperationFormContent } from './OperationFormContent'
import { DeleteOperationContent } from './DeleteOperationContent'

export type OperationForm = {
  type: 'income' | 'expense' | 'adjustment'
  category: string
  amount: string
  date: Date
  description: string
}

export type ModalOpen =
  | { type: 'create' }
  | { type: 'edit' | 'delete', operation: Operation }
  | null

export type OperationModalStyles = {
  types: ViewStyle
  typesRow: ViewStyle
  typeHalf: ViewStyle
  typeButton: ViewStyle
  typeSelected: ViewStyle
  typeText: TextStyle
  typeSelectedText: TextStyle
  field: ViewStyle
  label: TextStyle
  input: TextStyle & { backgroundColor: string, color: string }
  selector: ViewStyle
  categoryList: ViewStyle
  categoryText: TextStyle
  categorySelected: { backgroundColor: string }
  categoryArrow: { width: number, height: number, tintColor: string }
  placeholder: TextStyle
  description: TextStyle
  actions: ViewStyle
  button: ViewStyle
  cancelButton: ViewStyle
  buttonText: TextStyle
  cancelText: TextStyle
  message: TextStyle
  deleteButton: ViewStyle
  buttonPressed: ViewStyle
}

type OperationModalProps = {
  modalOpen: ModalOpen
  form: OperationForm
  balance: number
  blurTarget: RefObject<ViewInstance | null>
  onChangeForm: (data: Partial<OperationForm>) => void
  onCreate: (operation: Omit<Operation, 'id'>) => void
  onEdit: (operation: Omit<Operation, 'id'>) => void
  onDelete: () => void
  onClose: () => void
}

export default function OperationModal({ modalOpen, form, balance, blurTarget, onChangeForm, onCreate, onEdit, onDelete, onClose }: OperationModalProps) {
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
    message: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text
    },
    deleteButton: {
      backgroundColor: colors.error
    },
    buttonPressed: {
      opacity: 0.6
    }
  }))

  //Проверка формы перед сохранением
  function validateForm(amount: number) {
    if (!form.amount || form.amount === '-') {
      showMessage('Введите сумму')
      return false
    }

    if (form.type !== 'adjustment' && amount === 0) {
      showMessage('Сумма дохода или расхода должна быть больше нуля')
      return false
    }

    if (form.type !== 'adjustment' && !form.category) {
      showMessage('Выберите категорию')
      return false
    }

    return true
  }

  //Сохранение новой или отредактированной операции
  function saveOperation() {
    const amount = Math.round(Number(form.amount.replace(',', '.')) * 100)

    if (!validateForm(amount)) return

    const data = { ...form, amount, description: form.description.trim() }

    if (modalOpen?.type === 'edit') {
      onEdit(data)
    }
    else {
      onCreate(data)
    }

    closeModal()
  }

  //Подтверждение удаления операции
  function confirmDelete() {
    onDelete()
    closeModal()
  }

  //Закрытие окна
  function closeModal() {
    onClose()
  }

  //Заголовок окна по выбранному действию
  function getModalTitle() {
    switch (modalOpen?.type) {
      case 'edit':
        return 'Редактирование операции'
      case 'delete':
        return 'Удаление операции'
      default:
        return 'Новая операция'
    }
  }

  //Содержимое общего модального окна
  function getModalContent() {
    switch (modalOpen?.type) {
      case 'delete':
        return <DeleteOperationContent operation={modalOpen.operation} styles={styles} onDelete={confirmDelete} onClose={closeModal} />
      default:
        return (
          <OperationFormContent
            styles={styles}
            form={form}
            balance={balance}
            onChangeForm={onChangeForm}
            onSave={saveOperation}
            onClose={closeModal}
          />
        )
    }
  }

  return (
    <Modal visible={modalOpen !== null} transparent animationType="fade" onRequestClose={closeModal}>
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
                <Text style={styles.title}>{getModalTitle()}</Text>
                <Pressable onPress={closeModal} style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}>
                  <Image source={Close} style={styles.closeIcon} tintColor={styles.closeIcon.tintColor} />
                </Pressable>
              </View>
              {getModalContent()}
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}
