import { Close } from '@/assets/icons'
import { useStyles } from '@/hooks/useStyles'
import { BlurView } from 'expo-blur'
import { Image } from 'expo-image'
import type { RefObject } from 'react'
import { Modal, Pressable, ScrollView, Text, TextInput, View, type ViewInstance } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type OperationModalProps = {
  modalOpen: boolean
  blurTarget: RefObject<ViewInstance | null>
  onClose: () => void
}

export default function OperationModal({ modalOpen, blurTarget, onClose }: OperationModalProps) {
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
    buttonPressed: {
      opacity: 0.6
    }
  }))

  return (
    <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.container}>
        <BlurView
          blurTarget={blurTarget}
          blurMethod="dimezisBlurView"
          intensity={25}
          tint="dark"
          onTouchEnd={onClose}
          style={styles.backdrop}
        />
        <SafeAreaView style={styles.wrapper} pointerEvents="box-none">
          <View style={styles.modal}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
              <View style={styles.header}>
                <Text style={styles.title}>Новая операция</Text>
                <Pressable onPress={onClose} style={({ pressed }) => [styles.closeButton, pressed && styles.buttonPressed]}>
                  <Image source={Close} style={styles.closeIcon} tintColor={styles.closeIcon.tintColor} />
                </Pressable>
              </View>
              <View style={styles.types}>
                <View style={styles.typesRow}>
                  <Pressable style={({ pressed }) => [styles.typeButton, styles.typeHalf, pressed && styles.buttonPressed]}>
                    <Text style={styles.typeText}>Доход</Text>
                  </Pressable>
                  <Pressable style={({ pressed }) => [styles.typeButton, styles.typeHalf, styles.typeSelected, pressed && styles.buttonPressed]}>
                    <Text style={[styles.typeText, styles.typeSelectedText]}>Расход</Text>
                  </Pressable>
                </View>
                <Pressable style={({ pressed }) => [styles.typeButton, pressed && styles.buttonPressed]}>
                  <Text style={styles.typeText}>Изменить баланс</Text>
                </Pressable>
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Сумма</Text>
                <TextInput style={styles.input} placeholder="0 ₽" placeholderTextColor={styles.placeholder.color} editable={false} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Категория</Text>
                <TextInput style={styles.input} placeholder="Выберите категорию" placeholderTextColor={styles.placeholder.color} editable={false} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Дата</Text>
                <TextInput style={styles.input} placeholder="ДД.ММ.ГГГГ" placeholderTextColor={styles.placeholder.color} editable={false} />
              </View>
              <View style={styles.field}>
                <Text style={styles.label}>Описание</Text>
                <TextInput style={[styles.input, styles.description]} placeholder="На что потратили или откуда получили" placeholderTextColor={styles.placeholder.color} multiline editable={false} />
              </View>
              <View style={styles.actions}>
                <Pressable onPress={onClose} style={({ pressed }) => [styles.button, styles.cancelButton, pressed && styles.buttonPressed]}>
                  <Text style={[styles.buttonText, styles.cancelText]}>Отмена</Text>
                </Pressable>
                <Pressable style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
                  <Text style={styles.buttonText}>Сохранить</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  )
}
