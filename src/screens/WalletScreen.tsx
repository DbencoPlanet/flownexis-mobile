import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useGetWalletQuery,
  useGetTransactionsQuery,
  useFundWalletMutation,
} from "../store/api/baseApi";

export default function WalletScreen() {
  const [fundAmount, setFundAmount] = useState<string>("");

  const {
    data: walletRes,
    isLoading: walletLoading,
    refetch: refetchWallet,
  } = useGetWalletQuery();
  const {
    data: txRes,
    isLoading: txLoading,
    isFetching: txFetching,
    refetch: refetchTx,
  } = useGetTransactionsQuery({ page: 1, limit: 20 });
  const [fundWallet, { isLoading: isFunding }] = useFundWalletMutation();

  const handleFund = async () => {
    const amount = Number(fundAmount);
    if (!amount || amount <= 0)
      return Alert.alert("Invalid Amount", "Please enter a valid number.");

    try {
      await fundWallet({ amount }).unwrap();
      setFundAmount("");
      Alert.alert("Success", "Funds added to your Enterprise Ledger.");
    } catch (err: any) {
      Alert.alert(
        "Transaction Failed",
        err?.data?.message || "Unable to process deposit.",
      );
    }
  };

  const onRefresh = () => {
    refetchWallet();
    refetchTx();
  };

  const renderTransaction = ({ item }: { item: any }) => {
    const isCredit = item.type === "CREDIT";
    return (
      <View style={styles.txCard}>
        <View style={styles.txHeader}>
          <Text style={styles.txDesc} numberOfLines={1}>
            {item.description}
          </Text>
          <Text
            style={[
              styles.txAmount,
              isCredit ? styles.textGreen : styles.textRed,
            ]}
          >
            {isCredit ? "+" : "-"}${Number(item.amount).toFixed(2)}
          </Text>
        </View>
        <View style={styles.txFooter}>
          <Text style={styles.txDate}>
            {new Date(item.createdAt).toLocaleString()}
          </Text>
          <Text style={styles.txRef}>
            Ref: {item.reference || item.id.split("-")[0]}
          </Text>
        </View>
      </View>
    );
  };

  if (walletLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Decrypting Ledger Vault...</Text>
      </SafeAreaView>
    );
  }

  const wallet = walletRes?.data;
  const transactions = txRes?.data || [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={txFetching} onRefresh={onRefresh} />
        }
        ListHeaderComponent={
          <View style={styles.headerSection}>
            {/* Balance Card */}
            <View style={styles.balanceCard}>
              <Text style={styles.balanceLabel}>ENTERPRISE BALANCE</Text>
              <Text style={styles.balanceValue}>
                $
                {Number(wallet?.balance || 0).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </Text>
            </View>

            {/* Funding Actions */}
            <View style={styles.fundSection}>
              <TextInput
                style={styles.input}
                placeholder="Amount (USD)"
                keyboardType="decimal-pad"
                value={fundAmount}
                onChangeText={setFundAmount}
                placeholderTextColor="#94a3b8"
              />
              <TouchableOpacity
                style={[styles.fundButton, isFunding && styles.btnDisabled]}
                onPress={handleFund}
                disabled={isFunding || !fundAmount}
              >
                {isFunding ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Deposit</Text>
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Transaction History</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions recorded yet.</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 2,
    color: "#64748b",
  },
  listContent: { padding: 16, paddingBottom: 40 },
  headerSection: { marginBottom: 24 },
  balanceCard: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  balanceLabel: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  balanceValue: {
    color: "#ffffff",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: -1,
  },
  fundSection: { flexDirection: "row", gap: 12, marginBottom: 32 },
  input: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  fundButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    shadowColor: "#3b82f6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnDisabled: { opacity: 0.5 },
  btnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: 8,
  },
  txCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  txHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  txDesc: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#1e293b",
    marginRight: 12,
  },
  txAmount: { fontSize: 16, fontWeight: "900" },
  textGreen: { color: "#10b981" },
  textRed: { color: "#f43f5e" },
  txFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  txDate: { fontSize: 12, color: "#64748b", fontWeight: "500" },
  txRef: { fontSize: 11, color: "#94a3b8", fontFamily: "monospace" },
  emptyText: {
    textAlign: "center",
    color: "#94a3b8",
    marginTop: 40,
    fontWeight: "600",
  },
});
