import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetSubscriptionQuery,
  useGetSubscriptionPlansQuery,
  useUpgradeSubscriptionMutation,
} from "../store/api/baseApi";

export default function SubscriptionsScreen() {
  const { data: subRes, isLoading: subLoading } = useGetSubscriptionQuery();
  const { data: plansRes, isLoading: plansLoading } =
    useGetSubscriptionPlansQuery();
  const [upgrade, { isLoading: isUpgrading }] =
    useUpgradeSubscriptionMutation();

  const handleUpgrade = (planId: string, planName: string) => {
    Alert.alert(
      "Confirm Upgrade",
      `Are you sure you want to upgrade to the ${planName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          style: "default",
          onPress: async () => {
            try {
              await upgrade({ planId }).unwrap();
              Alert.alert("Success", "Subscription updated successfully.");
            } catch (e: any) {
              Alert.alert(
                "Error",
                e?.data?.message || "Failed to update subscription.",
              );
            }
          },
        },
      ],
    );
  };

  if (subLoading || plansLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  const activePlanId = subRes?.data?.planId;
  const plans = plansRes?.data || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Automation Tiers</Text>
        <Text style={styles.headerSub}>
          Scale your workflow execution limits.
        </Text>

        {plans.map((plan: any) => {
          const isActive = activePlanId === plan.id;
          const isEnterprise = plan.name.toLowerCase().includes("enterprise");

          return (
            <View
              key={plan.id}
              style={[
                styles.card,
                isActive && styles.cardActive,
                isEnterprise && !isActive && styles.cardEnterprise,
              ]}
            >
              {isActive && (
                <View style={styles.badgeActive}>
                  <Text style={styles.badgeText}>CURRENT PLAN</Text>
                </View>
              )}

              <Text
                style={[
                  styles.planName,
                  isEnterprise && !isActive && styles.textWhite,
                ]}
              >
                {plan.name}
              </Text>

              <View style={styles.priceRow}>
                <Text
                  style={[
                    styles.price,
                    isEnterprise && !isActive && styles.textWhite,
                  ]}
                >
                  ${Number(plan.priceMonthly)}
                </Text>
                <Text
                  style={[
                    styles.pricePeriod,
                    isEnterprise && !isActive && styles.textLight,
                  ]}
                >
                  /mo
                </Text>
              </View>

              <View style={styles.featuresList}>
                <Text
                  style={[
                    styles.featureItem,
                    isEnterprise && !isActive && styles.textLight,
                  ]}
                >
                  ✓ {plan.executionLimit.toLocaleString()} Executions/mo
                </Text>
                <Text
                  style={[
                    styles.featureItem,
                    isEnterprise && !isActive && styles.textLight,
                  ]}
                >
                  ✓ {plan.apiLimit.toLocaleString()} API Calls/day
                </Text>
                {plan.features?.aiEnabled && (
                  <Text style={[styles.featureItem, styles.featureAi]}>
                    ✦ Agentic AI Orchestration
                  </Text>
                )}
              </View>

              <TouchableOpacity
                disabled={isActive || isUpgrading}
                onPress={() => handleUpgrade(plan.id, plan.name)}
                style={[
                  styles.button,
                  isActive
                    ? styles.btnDisabled
                    : isEnterprise
                      ? styles.btnWhite
                      : styles.btnPrimary,
                ]}
              >
                <Text
                  style={[
                    styles.btnText,
                    isActive
                      ? styles.textMuted
                      : isEnterprise
                        ? styles.textDark
                        : styles.textWhite,
                  ]}
                >
                  {isActive ? "Active" : "Upgrade Plan"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f1f5f9" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  // 🚨 FIXED: Changed tracking to letterSpacing
  headerTitle: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -1,
  },
  headerSub: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 24,
    fontWeight: "500",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardActive: { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
  cardEnterprise: { backgroundColor: "#0f172a" },
  badgeActive: {
    alignSelf: "flex-start",
    backgroundColor: "#3b82f6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1,
  },
  planName: { fontSize: 22, fontWeight: "800", color: "#0f172a" },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 8,
    marginBottom: 20,
  },
  // 🚨 FIXED: Changed tracking to letterSpacing
  price: {
    fontSize: 48,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -2,
  },
  pricePeriod: {
    fontSize: 16,
    fontWeight: "700",
    color: "#64748b",
    marginLeft: 4,
  },
  featuresList: { marginBottom: 24, gap: 12 },
  featureItem: { fontSize: 15, fontWeight: "600", color: "#334155" },
  featureAi: { color: "#d97706" },
  button: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimary: { backgroundColor: "#0f172a" },
  btnWhite: { backgroundColor: "#ffffff" },
  btnDisabled: { backgroundColor: "#e2e8f0" },
  btnText: {
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  textWhite: { color: "#ffffff" },
  textLight: { color: "#94a3b8" },
  textDark: { color: "#0f172a" },
  textMuted: { color: "#94a3b8" },
});
