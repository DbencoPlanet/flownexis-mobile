import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGetBrandingQuery } from "../store/api/baseApi";
import { Activity, Clock, ShieldCheck, User } from "lucide-react-native";
import { useTheme } from "../theme/ThemeContext";

export default function ActivityFeedScreen() {
  const { colors } = useTheme();

  // Placeholder data - In Slice 11 we'll connect the real API
  const mockLogs = [
    {
      id: "1",
      action: "VAULT_ACCESS",
      user: "Admin",
      time: "2m ago",
      status: "SECURE",
    },
    {
      id: "2",
      action: "THEME_UPDATE",
      user: "System",
      time: "15m ago",
      status: "SUCCESS",
    },
    {
      id: "3",
      action: "USER_LOGIN",
      user: "Bernard",
      time: "1h ago",
      status: "SUCCESS",
    },
  ];

  const renderItem = ({ item }: any) => (
    <View
      style={[
        styles.logCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[styles.iconBox, { backgroundColor: colors.primary + "10" }]}
      >
        <Activity size={18} color={colors.primary} />
      </View>

      <View style={styles.logContent}>
        <View style={styles.logHeader}>
          <Text style={[styles.actionText, { color: colors.foreground }]}>
            {item.action}
          </Text>
          <Text style={[styles.statusBadge, { color: colors.primary }]}>
            {item.status}
          </Text>
        </View>

        <View style={styles.logMeta}>
          <View style={styles.metaItem}>
            <User size={10} color={colors.secondary} />
            <Text style={[styles.metaText, { color: colors.secondary }]}>
              {item.user}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={10} color={colors.secondary} />
            <Text style={[styles.metaText, { color: colors.secondary }]}>
              {item.time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <ShieldCheck size={28} color={colors.primary} />
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>
          Security Audit Trail
        </Text>
      </View>

      <FlatList
        data={mockLogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listPadding}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={{ color: colors.secondary }}>
              No logs found for this session.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, flexDirection: "row", alignItems: "center", gap: 12 },
  headerTitle: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  listPadding: { padding: 20 },
  logCard: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: "center",
    gap: 15,
  },
  iconBox: { padding: 12, borderRadius: 14 },
  logContent: { flex: 1 },
  logHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  actionText: { fontSize: 14, fontWeight: "800" },
  statusBadge: { fontSize: 8, fontWeight: "900", letterSpacing: 1 },
  logMeta: { flexDirection: "row", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 10, fontWeight: "700" },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
});
