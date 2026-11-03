import { OperationsProvider } from '@/context/OperationsContext'
import { openDatabase } from '@/db'
import { useEffect, useState } from 'react'
import { ActivityIndicator, Pressable, Text, View } from 'react-native'
import { useStyles } from '@/hooks/useStyles'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

export const unstable_settings = {
  anchor: '(tabs)'
}

export default function RootLayout() {
  const styles = useStyles((colors) => ({
    loading: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      gap: 16,
      backgroundColor: colors.background
    },
    message: {
      fontSize: 16,
      textAlign: 'center',
      color: colors.text
    },
    button: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 24,
      backgroundColor: colors.primary
    },
    buttonText: {
      color: colors.onPrimary,
      fontWeight: '600'
    },
    pressed: {
      opacity: 0.6
    },
    loader: {
      color: colors.primary
    },
    screen: {
      backgroundColor: colors.background
    },
    headerTitle: {
      color: colors.text
    }
  }))

  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  //Подготовка базы перед открытием экранов
  async function loadDatabase() {
    try {
      await openDatabase()
    }
    catch {
      setIsError(true)
    }
    finally {
      setIsLoading(false)
    }
  }

  //Повторная подготовка базы после ошибки
  function retryDatabase() {
    setIsLoading(true)
    setIsError(false)
    loadDatabase()
  }

  useEffect(() => {
    loadDatabase()
  }, [])

  if (isLoading || isError) {
    return (
      <View style={styles.loading}>
        <StatusBar style="auto" />
        {isLoading && <ActivityIndicator size="large" color={styles.loader.color} />}
        {!isLoading && isError && (
          <>
            <Text style={styles.message}>Не удалось подготовить базу данных</Text>
            <Pressable onPress={retryDatabase} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
              <Text style={styles.buttonText}>Повторить</Text>
            </Pressable>
          </>
        )}
      </View>
    )
  }

  return (
    <>
      <StatusBar style="auto" />
      <OperationsProvider>
        <Stack screenOptions={{
          animation: 'default',
          contentStyle: styles.screen,
          headerStyle: styles.screen,
          headerTintColor: styles.headerTitle.color,
          headerShadowVisible: false
        }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </OperationsProvider>
    </>
  )
}
