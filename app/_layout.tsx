import { AuthProvider } from "@/contexts/AuthContext";
import { Drawer } from "expo-router/drawer";
import React from "react";
import CustomDrawer from "./CustomDrawer";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Drawer
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          drawerStyle: { width: 280 },
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      />
    </AuthProvider>
  );
}
