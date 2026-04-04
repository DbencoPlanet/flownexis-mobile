import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { Workflow, Clipboard } from "lucide-react-native";

export default function FormHeader({
  name,
  workflowType,
}: {
  name: string;
  workflowType?: string;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.header,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.iconBg, { backgroundColor: colors.primary + "15" }]}>
        {workflowType ? (
          <Workflow color={colors.primary} size={24} />
        ) : (
          <Clipboard color={colors.primary} size={24} />
        )}
      </View>
      <View>
        <Text style={[styles.title, { color: colors.foreground }]}>{name}</Text>
        <Text style={[styles.subtitle, { color: colors.primary }]}>
          {workflowType ? `PROCESS: ${workflowType}` : "INDEPENDENT FORM"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    gap: 15,
    marginBottom: 20,
  },
  iconBg: { padding: 12, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: "900", letterSpacing: -0.5 },
  subtitle: { fontSize: 10, fontWeight: "900", letterSpacing: 1, marginTop: 2 },
});
