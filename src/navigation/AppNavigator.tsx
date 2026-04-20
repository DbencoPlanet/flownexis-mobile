import React, { useEffect } from "react";
import { Platform } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme/ThemeContext";
import { RootState } from "../store";
import { hydrateToken } from "../store/slices/authSlice";
import { getToken } from "../utils/auth";

// SCREENS
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import ActivityFeedScreen from "../screens/ActivityFeedScreen";
import VaultScreen from "../screens/VaultScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TaskInboxScreen from "../screens/TaskInboxScreen";
import WorkflowsScreen from "../screens/WorkflowsScreen";
import WorkflowViewerScreen from "../screens/WorkflowViewerScreen";
import ExecutionsScreen from "../screens/ExecutionsScreen";
import ExecutionDetailScreen from "../screens/ExecutionDetailScreen";
import WalletScreen from "../screens/WalletScreen";
import SubscriptionsScreen from "../screens/SubscriptionsScreen";
import MarketplaceScreen from "../screens/marketplace/MarketplaceScreen";
import DocumentVaultScreen from "../screens/documents/DocumentVaultScreen";
import TaskDetailsScreen from "../screens/TaskDetailsScreen";
import IntegrationsScreen from "../screens/IntegrationsScreen";

import NotificationsScreen from "../screens/NotificationsScreen";
import AnalyticsScreen from "../screens/AnalyticsScreen";

import HeaderNotificationIcon from "../components/HeaderNotificationIcon";
import ConversationalFormScreen from "../screens/ConversationalFormScreen";

import {
  Home,
  ShieldAlert,
  Lock,
  User,
  ClipboardList,
  Network,
  ShoppingBag,
  HardDrive,
  Zap,
  BrainCircuit,
  MessageSquare,
} from "lucide-react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin =
    user?.roles?.includes("Tenant_Admin") ||
    user?.roles?.includes("Super_Admin");
  const isManagerOrAdmin = isAdmin || user?.roles?.includes("Manager");

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 8,
          height: Platform.OS === "ios" ? 65 + insets.bottom : 80,
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 20,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          marginBottom: Platform.OS === "android" ? 5 : 0,
        },
        headerStyle: {
          backgroundColor: colors.card,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: "900",
          color: colors.foreground,
          fontSize: 14,
          textTransform: "uppercase",
          letterSpacing: 1,
        },
        // 🔔 ATTACH THE BELL TO EVERY TAB HEADER
        headerRight: () => <HeaderNotificationIcon />,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
          title: "FlowNexis",
        }}
      />
      {isManagerOrAdmin && (
        <Tab.Screen
          name="WorkflowsTab"
          component={WorkflowsScreen}
          options={{
            tabBarIcon: ({ color }) => <Network color={color} size={22} />,
            title: "Workflows",
            headerShown: false,
          }}
        />
      )}
      {isAdmin && (
        <Tab.Screen
          name="Marketplace"
          component={MarketplaceScreen}
          options={{
            tabBarIcon: ({ color }) => <ShoppingBag color={color} size={22} />,
            title: "Market",
            headerShown: false,
          }}
        />
      )}
      {isManagerOrAdmin && (
        <Tab.Screen
          name="DocumentVault"
          component={DocumentVaultScreen}
          options={{
            tabBarIcon: ({ color }) => <HardDrive color={color} size={22} />,
            title: "Vault",
            headerShown: false,
          }}
        />
      )}
      {isAdmin && (
        <Tab.Screen
          name="Vault"
          component={VaultScreen}
          options={{
            tabBarIcon: ({ color }) => <Lock color={color} size={22} />,
            title: "Secrets",
          }}
        />
      )}
      <Tab.Screen
        name="Tasks"
        component={TaskInboxScreen}
        options={{
          tabBarIcon: ({ color }) => <ClipboardList color={color} size={22} />,
          title: "Tasks",
        }}
      />
      {isAdmin && (
        <Tab.Screen
          name="Integrations"
          component={IntegrationsScreen}
          options={{
            tabBarIcon: ({ color }) => <Zap color={color} size={22} />,
            title: "Hub",
          }}
        />
      )}
      <Tab.Screen
        name="Activity"
        component={ActivityFeedScreen}
        options={{
          tabBarIcon: ({ color }) => <ShieldAlert color={color} size={22} />,
          title: "Logs",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
          title: "Account",
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const dispatch = useDispatch();
  const { colors, isDark } = useTheme();
  const { isAuthenticated, isHydrated } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      dispatch(hydrateToken(token));
    };
    checkToken();
  }, [dispatch]);

  if (!isHydrated) return null;

  const NavTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: colors.primary,
      background: colors.background,
      card: colors.card,
      text: colors.foreground,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer theme={NavTheme}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen
              name="WorkflowViewer"
              component={WorkflowViewerScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="ExecutionsList"
              component={ExecutionsScreen}
              options={{ animation: "slide_from_right" }}
            />
            <Stack.Screen
              name="ExecutionDetail"
              component={ExecutionDetailScreen}
              options={{ presentation: "card", animation: "slide_from_bottom" }}
            />
            <Stack.Screen
              name="Wallet"
              component={WalletScreen}
              options={{ headerShown: true, title: "Enterprise Ledger" }}
            />
            <Stack.Screen
              name="Subscriptions"
              component={SubscriptionsScreen}
              options={{ headerShown: true, title: "Automation Tiers" }}
            />

            {/* 🚨 REGISTER SLICE 11 SCREENS */}
            <Stack.Screen
              name="Notifications"
              component={NotificationsScreen}
              options={{
                headerShown: true,
                title: "COMMAND ALERTS",
                animation: "slide_from_bottom",
              }}
            />
            <Stack.Screen
              name="Analytics"
              component={AnalyticsScreen}
              options={{ headerShown: true, title: "PROCESS INTELLIGENCE" }}
            />
            <Stack.Screen
              name="ConversationalForm"
              component={ConversationalFormScreen}
              options={{
                headerShown: true,
                title: "AI AGENT INTERFACE",
                animation: "slide_from_right",
                headerStyle: { backgroundColor: colors.card },
                headerTitleStyle: {
                  fontWeight: "900",
                  color: colors.primary,
                  fontSize: 12,
                },
              }}
            />
          </>
        )}
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{ animation: "slide_from_right", presentation: "modal" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
