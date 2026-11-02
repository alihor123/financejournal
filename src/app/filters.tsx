import { useStyles } from '@/hooks/useStyles'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function FiltersScreen() {
  const styles = useStyles((colors) => ({
    container: {
      flex: 1,
      backgroundColor: colors.background
    }
  }))

  return <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']} />
}
