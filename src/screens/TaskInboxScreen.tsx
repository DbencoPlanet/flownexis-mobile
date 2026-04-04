import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useGetDashboardStatsQuery } from "../store/api/baseApi"; // Replace with useGetTasksQuery
import { useTheme } from "../theme/ThemeContext";
import { ChevronRight, Clock, AlertCircle } from "lucide-react-native";

export default function TaskInboxScreen({ navigation }: any) {
  const { colors } = useTheme();

  // Example live tasks
  const tasks = [
    {
      id: "1",
      title: "Approve Expense Claim",
      type: "APPROVAL_GATE",
      priority: "HIGH",
    },
    {
      id: "2",
      title: "Upload ID Verification",
      type: "FILE_UPLOAD",
      priority: "MEDIUM",
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={tasks}
        contentContainerStyle={{ padding: 20 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            onPress={() =>
              navigation.navigate("FormEntry", { taskId: item.id })
            }
          >
            <View style={styles.cardInfo}>
              <Text style={[styles.title, { color: colors.foreground }]}>
                {item.title}
              </Text>
              <View style={styles.meta}>
                <Clock size={12} color={colors.secondary} />
                <Text style={[styles.metaText, { color: colors.secondary }]}>
                  {item.type}
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    item.priority === "HIGH" ? "#fee2e2" : "#f0f9ff",
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 8,
                  fontWeight: "900",
                  color: item.priority === "HIGH" ? "#ef4444" : "#0ea5e9",
                }}
              >
                {item.priority}
              </Text>
            </View>
            <ChevronRight size={18} color={colors.border} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardInfo: { flex: 1 },
  title: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
  meta: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 10, fontWeight: "700" },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
});
