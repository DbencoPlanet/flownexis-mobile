import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useTheme } from "../theme/ThemeContext";
import {
  useGetDashboardStatsQuery,
  useGetRecentWorkflowsQuery,
} from "../store/api/baseApi";
import {
  Activity,
  Zap,
  CheckCircle2,
  Clock,
  ChevronRight,
  AlertCircle,
} from "lucide-react-native";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);

  // 1. FETCH REAL DATA
  const {
    data: stats,
    isLoading: statsLoading,
    refetch: refetchStats,
    error: statsError,
  } = useGetDashboardStatsQuery();

  const {
    data: workflows,
    isLoading: flowsLoading,
    refetch: refetchFlows,
  } = useGetRecentWorkflowsQuery({ limit: 5 });

  const onRefresh = () => {
    refetchStats();
    refetchFlows();
  };

  const isDataLoading = statsLoading || flowsLoading;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isDataLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.secondary }]}>
            SYSTEM OVERVIEW
          </Text>
          <Text style={[styles.userName, { color: colors.foreground }]}>
            {user?.firstName || "Operator"}
          </Text>
        </View>

        {/* --- LIVE STATS --- */}
        <View style={styles.statsGrid}>
          {/* Active Flows Card */}
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Zap size={20} color={colors.primary} />
            {statsLoading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {stats?.activeFlows ?? 0}
              </Text>
            )}
            <Text style={[styles.statLabel, { color: colors.secondary }]}>
              Active Flows
            </Text>
          </View>

          {/* Completed Tasks Card */}
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <CheckCircle2 size={20} color="#10b981" />
            {statsLoading ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <Text style={[styles.statValue, { color: colors.foreground }]}>
                {stats?.completedTasks ?? 0}
              </Text>
            )}
            <Text style={[styles.statLabel, { color: colors.secondary }]}>
              Tasks Done
            </Text>
          </View>
        </View>

        {/* --- RECENT WORKFLOWS --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
              Recent Workflows
            </Text>
          </View>

          {flowsLoading && (
            <ActivityIndicator
              color={colors.primary}
              style={{ marginTop: 20 }}
            />
          )}

          {/* REAL WORKFLOW LIST */}
          {workflows?.map((flow) => (
            <TouchableOpacity
              key={flow.id}
              style={[
                styles.workflowItem,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View
                style={[
                  styles.iconBg,
                  { backgroundColor: colors.primary + "15" },
                ]}
              >
                <Activity size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[styles.workflowName, { color: colors.foreground }]}
                >
                  {flow.name}
                </Text>
                <View style={styles.workflowMeta}>
                  <Clock size={10} color={colors.secondary} />
                  <Text
                    style={[styles.workflowTime, { color: colors.secondary }]}
                  >
                    {new Date(flow.updatedAt).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <ChevronRight size={16} color={colors.secondary} opacity={0.5} />
            </TouchableOpacity>
          ))}

          {/* EMPTY STATE */}
          {!flowsLoading && workflows?.length === 0 && (
            <View style={styles.emptyState}>
              <AlertCircle size={40} color={colors.secondary} opacity={0.2} />
              <Text style={[styles.emptyText, { color: colors.secondary }]}>
                No workflows found.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  header: { marginBottom: 30, marginTop: 10 },
  greeting: { fontSize: 10, fontWeight: "900", letterSpacing: 2 },
  userName: { fontSize: 32, fontWeight: "900", letterSpacing: -1 },
  statsGrid: { flexDirection: "row", gap: 15, marginBottom: 35 },
  statCard: { flex: 1, padding: 20, borderRadius: 24, borderWidth: 1, gap: 8 },
  statValue: { fontSize: 24, fontWeight: "900" },
  statLabel: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  section: { gap: 12 },
  sectionHeader: { marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "900" },
  workflowItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,
    borderWidth: 1,
    gap: 15,
  },
  iconBg: { padding: 12, borderRadius: 16 },
  workflowName: { fontSize: 15, fontWeight: "800" },
  workflowMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  workflowTime: { fontSize: 10, fontWeight: "600" },
  emptyState: { alignItems: "center", padding: 40, gap: 10 },
  emptyText: { fontSize: 12, fontWeight: "700" },
});
