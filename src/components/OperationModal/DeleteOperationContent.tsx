import type { Operation } from '@/components/OperationCard'
import { Pressable, Text, View } from 'react-native'
import type { OperationModalStyles } from '.'

type DeleteOperationContentProps = {
  operation: Operation
  styles: OperationModalStyles
  onDelete: () => void
  onClose: () => void
}

export function DeleteOperationContent({ operation, styles, onDelete, onClose }: DeleteOperationContentProps) {
  return (
    <>
      <Text style={styles.message}>Удалить операцию «{operation.category}»?</Text>
      <View style={styles.actions}>
        <Pressable onPress={onClose} style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.buttonPressed]}>
          <Text style={[styles.buttonText, styles.cancelText]}>Отмена</Text>
        </Pressable>
        <Pressable onPress={onDelete} style={({ pressed }) => [styles.button, styles.deleteButton, pressed && styles.buttonPressed]}>
          <Text style={styles.buttonText}>Удалить</Text>
        </Pressable>
      </View>
    </>
  )
}
