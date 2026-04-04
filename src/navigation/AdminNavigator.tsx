import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import VaultScreen from "../screens/VaultScreen";
import { useTheme } from "../theme/ThemeContext";
import { useSelector } from "react-redux";
import { RootState } from "../store";

// Update the constant name as well:
const Stack = createStackNavigator();

export default function AdminNavigator() {
  const { colors } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin =
    user?.roles?.includes("Tenant_Admin") ||
    user?.roles?.includes("Super_Admin");

  if (!isAdmin) return null;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.foreground,
        headerTitleStyle: {
          fontWeight: "900",
          fontSize: 14,
          textTransform: "uppercase",
        },
      }}
    >
      <Stack.Screen
        name="Vault"
        component={VaultScreen}
        options={{ title: "Security Vault" }}
      />
    </Stack.Navigator>
  );
}
