import { Drawer } from "expo-router/drawer";
import CustomDrawer from "./CustomDrawer";

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "slide",
        drawerStyle: { width: 280 },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    />
  );
}