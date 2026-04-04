import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { removeToken } from "../utils/auth";
import {
  LogOut,
  User as UserIcon,
  ChevronRight,
  Shield,
  Moon,
  Sun,
  Settings,
} from "lucide-react-native";
import { useTheme } from "../theme/ThemeContext";
import { RootState } from "../store";

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    try {
      await removeToken(); // Clears SecureStore
      dispatch(logout()); // Updates Redux & kicks back to Login
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        {/* --- USER IDENTITY CARD --- */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={styles.avatarText}>
              {user?.firstName?.[0] || user?.email?.[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.foreground }]}>
              {user?.firstName || "User"} {user?.lastName || ""}
            </Text>
            <View style={styles.roleBadge}>
              <Shield size={10} color={colors.primary} />
              <Text style={[styles.userRole, { color: colors.primary }]}>
                {user?.roles?.[0]?.replace("_", " ") || "Standard Member"}
              </Text>
            </View>
          </View>
        </View>

        {/* --- SETTINGS SECTION --- */}
        <View style={styles.menuSection}>
          <Text style={[styles.sectionTitle, { color: colors.secondary }]}>
            Preference & Interface
          </Text>

          {/* THEME TOGGLE SWITCH */}
          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.iconBg,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                {isDark ? (
                  <Moon size={18} color={colors.primary} />
                ) : (
                  <Sun size={18} color={colors.primary} />
                )}
              </View>
              <Text style={[styles.menuText, { color: colors.foreground }]}>
                Dark Appearance
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + "50" }}
              thumbColor={isDark ? colors.primary : "#f4f3f4"}
            />
          </View>

          {/* PERSONAL INFO (Placeholder) */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.iconBg,
                  { backgroundColor: colors.secondary + "15" },
                ]}
              >
                <UserIcon size={18} color={colors.secondary} />
              </View>
              <Text style={[styles.menuText, { color: colors.foreground }]}>
                Personal Information
              </Text>
            </View>
            <ChevronRight size={18} color={colors.secondary} opacity={0.5} />
          </TouchableOpacity>

          {/* APP SETTINGS (Placeholder) */}
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
          >
            <View style={styles.menuItemLeft}>
              <View
                style={[
                  styles.iconBg,
                  { backgroundColor: colors.secondary + "15" },
                ]}
              >
                <Settings size={18} color={colors.secondary} />
              </View>
              <Text style={[styles.menuText, { color: colors.foreground }]}>
                App Settings
              </Text>
            </View>
            <ChevronRight size={18} color={colors.secondary} opacity={0.5} />
          </TouchableOpacity>
        </View>

        {/* --- LOGOUT ACTION --- */}
        <TouchableOpacity
          onPress={handleLogout}
          activeOpacity={0.8}
          style={[
            styles.logoutButton,
            { backgroundColor: isDark ? "#450a0a" : "#fee2e2" },
          ]}
        >
          <View style={styles.logoutLeft}>
            <View style={styles.logoutIconBg}>
              <LogOut size={18} color="#ef4444" />
            </View>
            <Text style={styles.logoutText}>Sign Out of FlowNexis</Text>
          </View>
          <ChevronRight size={18} color="#ef4444" opacity={0.3} />
        </TouchableOpacity>

        <Text style={[styles.footerText, { color: colors.secondary }]}>
          FlowNexis Mobile • Enterprise Slice 4 v1.0.5
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flexGrow: 1, padding: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
    borderRadius: 30,
    borderWidth: 1,
    marginBottom: 32,
    marginTop: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 26, fontWeight: "900" },
  userInfo: { marginLeft: 20, flex: 1 },
  userName: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 6,
  },
  userRole: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  menuSection: { marginBottom: 30 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 20,
    marginLeft: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    paddingHorizontal: 4,
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  iconBg: { padding: 10, borderRadius: 14 },
  menuText: { fontSize: 15, fontWeight: "700" },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 24,
    marginTop: 40,
    marginBottom: 10,
  },
  logoutLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  logoutIconBg: { backgroundColor: "#fff", padding: 10, borderRadius: 14 },
  logoutText: {
    color: "#ef4444",
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: -0.3,
  },
  footerText: {
    textAlign: "center",
    fontSize: 10,
    fontWeight: "800",
    opacity: 0.4,
    marginTop: 20,
    paddingBottom: 20,
  },
});
