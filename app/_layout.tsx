import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { AuthProvider } from '../context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Netflix-like Dark Theme colors
export const AppDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000000', // Deep black background
    card: '#141414',
    text: '#ffffff',
    primary: '#E50914', // Netflix red
    border: '#2A2A2A',
  },
};

export default function RootLayout() {
  return (
    <ThemeProvider value={AppDarkTheme}>
      <AuthProvider>
        <Stack screenOptions={{ 
          headerStyle: { backgroundColor: '#141414' },
          headerTintColor: '#fff',
          contentStyle: { backgroundColor: '#000' }
        }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="movie/[id]" options={{ title: 'Chi tiết phim', headerBackTitle: 'Back' }} />
          <Stack.Screen name="book/[showtimeId]" options={{ title: 'Đặt vé', headerBackTitle: 'Back' }} />
        </Stack>
      </AuthProvider>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
