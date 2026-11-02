import { Filter } from '@/assets/icons'
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
      padding: 24
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
      </View>
    </SafeAreaView>
  )
}
