import { ArrowDown } from '@/assets/icons'
import { useStyles } from '@/hooks/useStyles'
import { Image } from 'expo-image'
import { Pressable, Text, View } from 'react-native'

type FiltersProps = {
  onClose: () => void
}

export default function Filters({ onClose }: FiltersProps) {
  const styles = useStyles(colors => ({
    container: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      marginTop: 12,
      padding: 20,
      gap: 18,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      elevation: 6,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12
    },
    field: {
      gap: 8
    },
    label: {
      fontSize: 14,
      color: colors.textSecondary
    },
    row: {
      flexDirection: 'row',
      gap: 10
    },
    input: {
      flex: 1,
      minHeight: 46,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: colors.surfacePressed,
      justifyContent: 'center'
    },
    selector: {
      minHeight: 46,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: colors.surfacePressed,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    text: {
      fontSize: 15,
      color: colors.text
    },
    arrow: {
      width: 18,
      height: 18,
      tintColor: colors.textSecondary
    },
    button: {
      flex: 1,
      minHeight: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceSoft
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.onSurfaceSoft
    },
    applyButton: {
      backgroundColor: colors.primary
    },
    applyText: {
      color: colors.onPrimary
    },
    pressed: {
      opacity: 0.6
    }
  }))

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <Text style={styles.label}>Период</Text>
        <View style={styles.row}>
          <Pressable style={({ pressed }) => [styles.input, pressed && styles.pressed]}>
            <Text style={styles.text}>Дата начала</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.input, pressed && styles.pressed]}>
            <Text style={styles.text}>Дата конца</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.field}>
        <Text style={styles.label}>Категория</Text>
        <Pressable style={({ pressed }) => [styles.selector, pressed && styles.pressed]}>
          <Text style={styles.text}>Все категории</Text>
          <Image source={ArrowDown} style={styles.arrow} tintColor={styles.arrow.tintColor} />
        </Pressable>
      </View>
      <View style={styles.row}>
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>Сбросить</Text>
        </Pressable>
        <Pressable onPress={onClose} style={({ pressed }) => [styles.button, styles.applyButton, pressed && styles.pressed]}>
          <Text style={[styles.buttonText, styles.applyText]}>Применить</Text>
        </Pressable>
      </View>
    </View>
  )
}
