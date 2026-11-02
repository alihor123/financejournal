import { useStyles } from '@/hooks/useStyles'
import { Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function StatisticsScreen() {
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
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: colors.text
    }
  }))

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.content}>
        <Text style={styles.title}>Статистика</Text>
      </View>
    </SafeAreaView>
  )
}
