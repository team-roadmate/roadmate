// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    const initialize = async () => {
      await checkAuth();
      setIsReady(true);
    };
    
    initialize();
  }, []);

  if (!isReady) {
    return null; // 또는 로딩 스피너
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
