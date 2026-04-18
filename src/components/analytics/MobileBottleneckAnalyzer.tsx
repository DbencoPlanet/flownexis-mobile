import React from "react";
import { View, Text, ScrollView, Dimensions } from "react-native";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { AlertCircle, Zap, Activity } from "lucide-react-native";

const screenWidth = Dimensions.get("window").width;

export default function MobileBottleneckAnalyzer({
  intelligence,
}: {
  intelligence: any[];
}) {
  // Map data for Gifted Charts
  const barData = intelligence.map((node) => ({
    value: node.avgMinutes,
    label: node.name.substring(0, 5),
    frontColor: node.isBottleneck ? "#f59e0b" : "#3b82f6",
  }));

  const mostDelayed = [...intelligence].sort(
    (a, b) => b.avgMinutes - a.avgMinutes,
  )[0];

  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
      {/* 📊 SUMMARY CARDS - STACKED FOR MOBILE */}
      <View style={{ padding: 20, gap: 12 }}>
        <MobileStatCard
          title="Critical Bottleneck"
          value={mostDelayed?.name || "Clear"}
          sub={`${mostDelayed?.avgMinutes || 0}m delay`}
          icon={<AlertCircle size={20} color="#f59e0b" />}
          bg="#fffbeb"
        />
        <MobileStatCard
          title="System Velocity"
          value="82%"
          sub="Avg. Efficiency"
          icon={<Zap size={20} color="#10b981" />}
          bg="#f0fdf4"
        />
      </View>

      {/* 📈 LATENCY CHART */}
      <View
        style={{
          padding: 20,
          backgroundColor: "#fff",
          margin: 20,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "#f1f5f9",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "900",
            color: "#94a3b8",
            marginBottom: 20,
          }}
        >
          NODE LATENCY (AVG MIN)
        </Text>
        <BarChart
          data={barData}
          barWidth={35}
          noOfSections={3}
          barBorderRadius={8}
          frontColor={"#3b82f6"}
          yAxisThickness={0}
          xAxisThickness={0}
          hideRules
          topLabelTextStyle={{ color: "#94a3b8", fontSize: 10 }}
        />
      </View>

      {/* 🌀 REWORK AREA CHART */}
      <View
        style={{
          padding: 20,
          backgroundColor: "#fff",
          margin: 20,
          marginTop: 0,
          borderRadius: 24,
          borderWidth: 1,
          borderColor: "#f1f5f9",
        }}
      >
        <Text
          style={{
            fontSize: 10,
            fontWeight: "900",
            color: "#94a3b8",
            marginBottom: 20,
          }}
        >
          REWORK LOOPS %
        </Text>
        <LineChart
          data={intelligence.map((n) => ({ value: n.reworkRate }))}
          areaChart
          curved
          startFillColor="#10b981"
          startOpacity={0.2}
          endFillColor="#10b981"
          endOpacity={0.01}
          color="#10b981"
          thickness={3}
          hideDataPoints
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
        />
      </View>
    </ScrollView>
  );
}

function MobileStatCard({ title, value, sub, icon, bg }: any) {
  return (
    <View
      style={{
        padding: 16,
        borderRadius: 20,
        backgroundColor: bg,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: "#fff",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 12,
        }}
      >
        {icon}
      </View>
      <View>
        <Text
          style={{
            fontSize: 9,
            fontWeight: "900",
            color: "#64748b",
            textTransform: "uppercase",
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "800", color: "#1e293b" }}>
          {value}
        </Text>
        <Text style={{ fontSize: 10, color: "#94a3b8" }}>{sub}</Text>
      </View>
    </View>
  );
}
