// app/(guide)/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function GuideLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="route-guide" />
        <Stack.Screen name="route-complete" />
      </Stack>
    </>
  );
}
