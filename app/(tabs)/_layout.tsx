// app/(tabs)/_layout.tsx
import { Tabs, useRouter } from "expo-router";
import { useEffect } from "react";
import { useAuthStore } from "../../src/store/authStore";

export default function TabsLayout() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: "홈",
          tabBarIcon: () => null, // 아이콘은 나중에 추가
        }}
      />
    </Tabs>
  );
}
