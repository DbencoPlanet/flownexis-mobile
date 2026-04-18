import React from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { useGetProcessMiningQuery } from "../store/api/baseApi";
import MobileBottleneckAnalyzer from "../components/analytics/MobileBottleneckAnalyzer";

export default function AnalyticsScreen() {
  // Fetch real intelligence from the Slice 11 worker cache
  const {
    data: miningRes,
    isLoading,
    error,
  } = useGetProcessMiningQuery(undefined);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text
          style={{
            marginTop: 10,
            fontSize: 10,
            fontWeight: "900",
            opacity: 0.3,
          }}
        >
          MINING PROTOCOLS...
        </Text>
      </View>
    );
  }

  const intelligence = miningRes?.data || [];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fafc" }}>
      <MobileBottleneckAnalyzer intelligence={intelligence} />
    </View>
  );
}
