import React from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import { Moon, Sun } from "lucide-react-native";
import { useTheme } from "../theme/ThemeContext";

export default function ThemeToggle() {
  const { colors, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.inputBg }]}>
      <View style={styles.left}>
        {isDark ? (
          <Moon size={20} color={colors.primary} />
        ) : (
          <Sun size={20} color={colors.primary} />
        )}
        <Text style={[styles.label, { color: colors.foreground }]}>
          {isDark ? "Dark Mode Active" : "Light Mode Active"}
        </Text>
      </View>

      <Switch
        trackColor={{ false: colors.border, true: colors.primary + "50" }}
        thumbColor={isDark ? colors.primary : "#f4f3f4"}
        ios_backgroundColor={colors.border}
        value={isDark}
        // In this architecture, it follows system settings.
        // Manual override requires adding a toggleState to ThemeContext.
        disabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 20,
    marginTop: 10,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 12 },
  label: { fontSize: 13, fontWeight: "700" },
});
