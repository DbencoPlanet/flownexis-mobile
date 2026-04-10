import "react-native-gesture-handler";
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

// [ADDED] Slice 6 Workflow Screens
import WorkflowsScreen from "./src/screens/WorkflowsScreen";
import WorkflowViewerScreen from "./src/screens/WorkflowViewerScreen";
import ExecutionsScreen from "./src/screens/ExecutionsScreen";
import ExecutionDetailScreen from "./src/screens/ExecutionDetailScreen";

// [ADDED] Slice 8 Marketplace & Documents
import MarketplaceScreen from "./src/screens/marketplace/MarketplaceScreen";
import DocumentVaultScreen from "./src/screens/documents/DocumentVaultScreen";

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
  Network,
  // [ADDED] Slice 8 Icons
  ShoppingBag,
  HardDrive,
} from "lucide-react-native";
import TaskDetailsScreen from "./src/screens/TaskDetailsScreen";

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

  // Workflows and Documents are visible to Admins and Managers
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

      {/* [ADDED] Workflows Tab */}
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

      {/* {isAdmin && (
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
      )} */}

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

/**
 * --- ROOT APP ---
 */
export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationWrapper />
        </ThemeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

// import "react-native-gesture-handler"; // CRITICAL: Must be the first import
// import React, { useEffect } from "react";
// import { Platform } from "react-native";
// import {
//   NavigationContainer,
//   DefaultTheme,
//   DarkTheme,
// } from "@react-navigation/native";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { Provider, useDispatch, useSelector } from "react-redux";
// import { StatusBar } from "expo-status-bar";
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";

// // 1. COMPONENTS & THEME
// import { ThemeProvider, useTheme } from "./src/theme/ThemeContext";
// import LoginScreen from "./src/screens/LoginScreen";
// import HomeScreen from "./src/screens/HomeScreen";
// import ActivityFeedScreen from "./src/screens/ActivityFeedScreen";
// import VaultScreen from "./src/screens/VaultScreen";
// import ProfileScreen from "./src/screens/ProfileScreen";
// import TaskInboxScreen from "./src/screens/TaskInboxScreen";

// // [ADDED] Slice 6 Workflow Screens
// import WorkflowsScreen from "./src/screens/WorkflowsScreen";
// import WorkflowViewerScreen from "./src/screens/WorkflowViewerScreen";
// import ExecutionsScreen from "./src/screens/ExecutionsScreen";
// import ExecutionDetailScreen from "./src/screens/ExecutionDetailScreen";

// // 2. UTILS & STORE
// import { store, RootState } from "./src/store";
// import { hydrateToken } from "./src/store/slices/authSlice";
// import { getToken } from "./src/utils/auth";

// // 3. ICONS
// import {
//   Home,
//   ShieldAlert,
//   Lock,
//   User,
//   ClipboardList,
//   Network, // [ADDED] Icon for the workflows tab
// } from "lucide-react-native";
// import TaskDetailsScreen from "./src/screens/TaskDetailsScreen";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// /**
//  * --- TAB NAVIGATION ---
//  */
// function TabNavigator() {
//   const { colors } = useTheme();
//   const insets = useSafeAreaInsets();
//   const { user } = useSelector((state: RootState) => state.auth);

//   const isAdmin =
//     user?.roles?.includes("Tenant_Admin") ||
//     user?.roles?.includes("Super_Admin");

//   // [ADDED] Workflows are visible to Admins and Managers
//   const isManagerOrAdmin = isAdmin || user?.roles?.includes("Manager");

//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.secondary,
//         tabBarStyle: {
//           backgroundColor: colors.card,
//           borderTopColor: colors.border,
//           borderTopWidth: 1,
//           elevation: 8,
//           height: Platform.OS === "ios" ? 65 + insets.bottom : 80,
//           paddingTop: 10,
//           paddingBottom: Platform.OS === "ios" ? insets.bottom : 20,
//         },
//         tabBarLabelStyle: {
//           fontSize: 10,
//           fontWeight: "800",
//           marginBottom: Platform.OS === "android" ? 5 : 0,
//         },
//         tabBarIconStyle: {
//           marginTop: 0,
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
//         tabBarHideOnKeyboard: true,
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

//       {/* [ADDED] Workflows Tab */}
//       {isManagerOrAdmin && (
//         <Tab.Screen
//           name="WorkflowsTab"
//           component={WorkflowsScreen}
//           options={{
//             tabBarIcon: ({ color }) => <Network color={color} size={22} />,
//             title: "Workflows",
//             headerShown: false, // We built a custom header in the screen itself
//           }}
//         />
//       )}

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
//         name="Tasks"
//         component={TaskInboxScreen}
//         options={{
//           tabBarIcon: ({ color }) => <ClipboardList color={color} size={22} />,
//           title: "My Tasks",
//         }}
//       />

//       <Stack.Screen name="ExecutionsList" component={ExecutionsScreen} />
//       <Stack.Screen
//         name="ExecutionDetail"
//         component={ExecutionDetailScreen}
//         options={{ presentation: "card" }} // Provides a nice slide-in effect
//       />

//       <Tab.Screen
//         name="Activity"
//         component={ActivityFeedScreen}
//         options={{
//           tabBarIcon: ({ color }) => <ShieldAlert color={color} size={22} />,
//           title: "Audit Logs",
//         }}
//       />

//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           tabBarIcon: ({ color }) => <User color={color} size={22} />,
//           title: "My Account",
//         }}
//       />
//     </Tab.Navigator>
//   );
// }

// /**
//  * --- NAVIGATION WRAPPER ---
//  */
// function NavigationWrapper() {
//   const dispatch = useDispatch();
//   const { colors, isDark } = useTheme();
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
//           <>
//             <Stack.Screen name="Main" component={TabNavigator} />
//             {/* [ADDED] Detail screen pushed to Root Stack so it covers the Tab Bar */}
//             <Stack.Screen
//               name="WorkflowViewer"
//               component={WorkflowViewerScreen}
//               options={{ animation: "slide_from_right" }}
//             />
//           </>
//         )}
//         <Stack.Screen
//           name="TaskDetails"
//           component={TaskDetailsScreen}
//           options={{ animation: "slide_from_right", presentation: "modal" }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// /**
//  * --- ROOT APP ---
//  */
// export default function App() {
//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <ThemeProvider>
//           <NavigationWrapper />
//         </ThemeProvider>
//       </SafeAreaProvider>
//     </Provider>
//   );
// }
