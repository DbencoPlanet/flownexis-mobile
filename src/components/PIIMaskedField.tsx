import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Eye, EyeOff, ShieldAlert } from "lucide-react-native";
import { useTheme } from "../theme/ThemeContext";

export default function PIIMaskedField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  const [revealed, setRevealed] = useState(false);

  const maskedValue =
    value.length > 4 ? `•••• •••• •••• ${value.slice(-4)}` : "••••";

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.secondary }]}>{label}</Text>
      <View
        style={[
          styles.field,
          { backgroundColor: colors.inputBg, borderColor: colors.border },
        ]}
      >
        <Text
          style={[
            styles.value,
            { color: revealed ? colors.foreground : colors.secondary },
          ]}
        >
          {revealed ? value : maskedValue}
        </Text>
        <TouchableOpacity
          onPress={() => setRevealed(!revealed)}
          style={styles.icon}
        >
          {revealed ? (
            <EyeOff size={18} color={colors.primary} />
          ) : (
            <Eye size={18} color={colors.secondary} />
          )}
        </TouchableOpacity>
      </View>
      {!revealed && (
        <View style={styles.warningRow}>
          <ShieldAlert size={10} color={colors.secondary} />
          <Text style={[styles.warningText, { color: colors.secondary }]}>
            PII DATA MASKED
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: {
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  value: { flex: 1, fontSize: 14, fontFamily: "Courier" },
  icon: { padding: 4 },
  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    opacity: 0.5,
  },
  warningText: {
    fontSize: 8,
    fontWeight: "900",
    marginLeft: 4,
    letterSpacing: 0.5,
  },
});
