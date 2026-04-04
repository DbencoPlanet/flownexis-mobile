import "react-native-gesture-handler"; // CRITICAL: Must be the first import
import React, { useEffect } from "react";
import { Platform } from "react-native";
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider, useDispatch, useSelector } from "react-redux";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// 1. COMPONENTS & THEME
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ActivityFeedScreen from "./src/screens/ActivityFeedScreen";
import VaultScreen from "./src/screens/VaultScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import TaskInboxScreen from "./src/screens/TaskInboxScreen";

// 2. UTILS & STORE
import { store, RootState } from "./src/store";
import { hydrateToken } from "./src/store/slices/authSlice";
import { getToken } from "./src/utils/auth";

// 3. ICONS
import {
  Home,
  ShieldAlert,
  Lock,
  User,
  ClipboardList,
} from "lucide-react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * --- TAB NAVIGATION ---
 */
function TabNavigator() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useSelector((state: RootState) => state.auth);

  const isAdmin =
    user?.roles?.includes("Tenant_Admin") ||
    user?.roles?.includes("Super_Admin");

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
        // [FIXED] Aggressive Safe Area Layout for Android Buttons & iOS Bar
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          elevation: 8, // Adds shadow on Android to separate from buttons
          height: Platform.OS === "ios" ? 65 + insets.bottom : 80, // Taller bar for Android
          paddingTop: 10,
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 20, // Forces 20px extra on Android
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "800",
          marginBottom: Platform.OS === "android" ? 5 : 0, // Lift text higher on Android
        },
        tabBarIconStyle: {
          marginTop: 0,
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
        tabBarHideOnKeyboard: true, // Prevents bar from jumping up when typing
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

      {isAdmin && (
        <Tab.Screen
          name="Vault"
          component={VaultScreen}
          options={{
            tabBarIcon: ({ color }) => <Lock color={color} size={22} />,
            title: "Security Vault",
          }}
        />
      )}

      <Tab.Screen
        name="Activity"
        component={ActivityFeedScreen}
        options={{
          tabBarIcon: ({ color }) => <ShieldAlert color={color} size={22} />,
          title: "Audit Logs",
        }}
      />
      <Tab.Screen
        name="Tasks"
        component={TaskInboxScreen}
        options={{
          tabBarIcon: ({ color }) => <ClipboardList color={color} size={22} />,
          title: "My Tasks",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
          title: "My Account",
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * --- NAVIGATION WRAPPER ---
 */
function NavigationWrapper() {
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
          <Stack.Screen name="Main" component={TabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

/**
 * --- ROOT APP ---
 */
export default function App() {
  return (
    <Provider store={store}>
      {/* [ADDED] SafeAreaProvider must wrap the theme and navigation */}
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationWrapper />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}
// import "react-native-gesture-handler";
// import React, { useEffect } from "react";
// import {
//   NavigationContainer,
//   DefaultTheme,
//   DarkTheme,
// } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import { StatusBar } from "expo-status-bar";

// // 1. COMPONENTS & THEME
// import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
// import LoginScreen from "./src/screens/LoginScreen";
// import HomeScreen from "./src/screens/HomeScreen";
// import ActivityFeedScreen from "./src/screens/ActivityFeedScreen";
// import VaultScreen from "./src/screens/VaultScreen"; // [NEW] Slice 4

// // 2. UTILS & STORE
// import { store, RootState } from "./src/store";
// import { hydrateToken } from "./src/store/slices/authSlice";
// import { getToken } from "./src/utils/auth";

// // 3. ICONS
// import { Home, ShieldAlert, Lock } from "lucide-react-native";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// /**
//  * TAB NAVIGATION
//  * Uses useTheme() to pull dynamic branding (Slice 4)
//  */
// function TabNavigator() {
//   const { colors } = useTheme();
//   const { user } = useSelector((state: RootState) => state.auth);

//   // Check RBAC for Vault visibility
//   const isAdmin =
//     user?.roles?.includes("Tenant_Admin") ||
//     user?.roles?.includes("Super_Admin");

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: colors.primary, // [DYNAMIC]
//         tabBarInactiveTintColor: colors.secondary, // [DYNAMIC]
//         tabBarStyle: {
//           backgroundColor: colors.card,
//           borderTopColor: colors.border,
//         },
//         headerStyle: {
//           backgroundColor: colors.card,
//           borderBottomWidth: 1,
//           borderBottomColor: colors.border,
//         },
//         headerTitleStyle: {
//           fontWeight: "900",
//           color: colors.foreground,
//           fontSize: 14,
//           textTransform: "uppercase",
//           letterSpacing: 1,
//         },
//       }}
//     >
//       <Tab.Screen
//         name="Dashboard"
//         component={HomeScreen}
//         options={{
//           tabBarIcon: ({ color }) => <Home color={color} size={22} />,
//           title: "FlowNexis",
//         }}
//       />

//       {/* [NEW] SLICE 4: VAULT (Only for Admins) */}
//       {isAdmin && (
//         <Tab.Screen
//           name="Vault"
//           component={VaultScreen}
//           options={{
//             tabBarIcon: ({ color }) => <Lock color={color} size={22} />,
//             title: "Security Vault",
//           }}
//         />
//       )}

//       <Tab.Screen
//         name="Activity"
//         component={ActivityFeedScreen}
//         options={{
//           tabBarIcon: ({ color }) => <ShieldAlert color={color} size={22} />,
//           title: "Audit Logs",
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// /**
//  * MAIN NAVIGATION LOGIC
//  */
// function NavigationWrapper() {
//   const dispatch = useDispatch();
//   const { colors, isDark } = useTheme(); // [DYNAMIC]
//   const { isAuthenticated, isHydrated } = useSelector(
//     (state: RootState) => state.auth,
//   );

//   useEffect(() => {
//     const checkToken = async () => {
//       const token = await getToken();
//       dispatch(hydrateToken(token));
//     };
//     checkToken();
//   }, [dispatch]);

//   if (!isHydrated) return null;

//   // Custom theme object for React Navigation Container
//   const NavTheme = {
//     ...(isDark ? DarkTheme : DefaultTheme),
//     colors: {
//       ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
//       primary: colors.primary,
//       background: colors.background,
//       card: colors.card,
//       text: colors.foreground,
//       border: colors.border,
//     },
//   };

//   return (
//     <NavigationContainer theme={NavTheme}>
//       <StatusBar style={isDark ? "light" : "dark"} />

//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {!isAuthenticated ? (
//           <Stack.Screen name="Login" component={LoginScreen} />
//         ) : (
//           <Stack.Screen name="Main" component={TabNavigator} />
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// /**
//  * ROOT APP
//  * Wrapped in ThemeProvider to enable useGetBrandingQuery
//  */
// export default function App() {
//   return (
//     <Provider store={store}>
//       <ThemeProvider>
//         <NavigationWrapper />
//       </ThemeProvider>
//     </Provider>
//   );
// }
