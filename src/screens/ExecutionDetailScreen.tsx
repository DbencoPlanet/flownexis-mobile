import React from "react";
import { View, Text, ScrollView, SafeAreaView, StyleSheet } from "react-native";
import { useGetExecutionTraceQuery } from "../store/api/baseApi";
import MobileReplayPlayer from "../components/execution/MobileReplayPlayer";
import { ShieldCheck, Activity } from "lucide-react-native";

export default function ExecutionDetailScreen({ route }: any) {
  const { id } = route.params;
  const { data: res, isLoading } = useGetExecutionTraceQuery(id);

  if (isLoading)
    return (
      <View style={styles.center}>
        <Text>Loading Evidence...</Text>
      </View>
    );

  const execution = res?.data;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        <View style={styles.header}>
          <Text style={styles.badge}>IMMUTABLE TRACE ACTIVE</Text>
          <Text style={styles.title}>{execution.workflow.name}</Text>
          <View style={styles.row}>
            <ShieldCheck size={16} color="#10b981" />
            <Text style={styles.statusText}>VERIFIED BY FLOWNEXIS ENGINE</Text>
          </View>
        </View>

        <MobileReplayPlayer execution={execution} />

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Activity size={20} color="#3b82f6" />
            <View>
              <Text style={styles.statLabel}>Current State</Text>
              <Text style={styles.statValue}>{execution.status}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statItem}>
            <View>
              <Text style={styles.statLabel}>Current Node</Text>
              <Text style={[styles.statValue, { color: "#3b82f6" }]}>
                {execution.currentStep || "Finished"}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#FFF" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  container: { flex: 1, padding: 20 },
  header: { marginBottom: 30 },
  badge: {
    fontSize: 10,
    fontWeight: "900",
    color: "#10b981",
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
  },
  row: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  statusText: { fontSize: 10, fontWeight: "700", color: "#64748b" },
  statsCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 32,
    padding: 25,
    marginTop: 20,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 15 },
  statLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase", // FIXED: Changed from uppercase: true
  },
  statValue: { fontSize: 18, fontWeight: "900", color: "#0f172a" },
  divider: { height: 1, backgroundColor: "#e2e8f0", marginVertical: 20 },
});
