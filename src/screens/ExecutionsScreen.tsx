import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useGetOngoingExecutionsQuery } from "../store/api/baseApi";
import { Activity, ChevronRight, Clock, Box } from "lucide-react-native";

export default function ExecutionsScreen({ navigation }: any) {
  // Fetch with pagination (page 1, limit 20)
  const {
    data: res,
    isLoading,
    refetch,
    isFetching,
  } = useGetOngoingExecutionsQuery({
    page: 1,
    limit: 20,
  });

  const executions = res?.data || [];

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>FETCHING AUDIT TRAILS...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Requests</Text>
        <Text style={styles.subtitle}>
          Track your active workflow protocols
        </Text>
      </View>

      <FlatList
        data={executions}
        keyExtractor={(item) => item.id}
        refreshing={isFetching}
        onRefresh={refetch}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Box size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No active executions found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ExecutionDetail", { id: item.id })
            }
            style={styles.card}
            activeOpacity={0.7}
          >
            <View style={styles.cardMain}>
              <View style={styles.workflowIcon}>
                <Activity size={18} color="#3b82f6" />
              </View>

              <View style={styles.info}>
                <Text style={styles.workflowName}>
                  {item.workflow?.name || "Unnamed Flow"}
                </Text>
                <View style={styles.metaRow}>
                  <Clock size={10} color="#94a3b8" />
                  <Text style={styles.metaText}>
                    {new Date(item.startedAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.idText}>#{item.id.split("-")[0]}</Text>
                </View>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "RUNNING"
                    ? styles.statusRunning
                    : styles.statusDone,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "RUNNING"
                      ? styles.textRunning
                      : styles.textDone,
                  ]}
                >
                  {item.status}
                </Text>
              </View>

              <ChevronRight size={20} color="#cbd5e1" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: {
    marginTop: 12,
    fontSize: 10,
    fontWeight: "900",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  header: { padding: 24, paddingTop: 60, backgroundColor: "#fff" },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
  },
  subtitle: { fontSize: 13, color: "#64748b", fontWeight: "500", marginTop: 4 },
  card: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    padding: 16,
    // Soft shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardMain: { flexDirection: "row", alignItems: "center" },
  workflowIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  info: { flex: 1 },
  workflowName: { fontSize: 15, fontWeight: "800", color: "#1e293b" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 4, gap: 6 },
  metaText: { fontSize: 11, color: "#94a3b8", fontWeight: "600" },
  idText: { fontSize: 10, color: "#cbd5e1", fontFamily: "monospace" },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 10,
  },
  statusRunning: { backgroundColor: "#eff6ff" },
  statusDone: { backgroundColor: "#f0fdf4" },
  statusText: { fontSize: 9, fontWeight: "900" },
  textRunning: { color: "#3b82f6" },
  textDone: { color: "#22c55e" },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    opacity: 0.5,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
});
