// app/_layout.tsx
import { createDrawerNavigator } from "@react-navigation/drawer";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useAuthStore } from "../../src/store/authStore";
import HomeScreen from "./home";

const Drawer = createDrawerNavigator();

export default function RootLayout() {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated]);

  return (
    <>
      <StatusBar style="dark" />
      <Drawer.Navigator
        screenOptions={{ headerShown: false, drawerPosition: "right" }}
      >
        <Drawer.Screen name="Home" component={HomeScreen} />
      </Drawer.Navigator>
    </>
  );
}
