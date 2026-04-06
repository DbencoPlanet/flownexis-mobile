import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetWorkflowsQuery } from "../store/api/baseApi";
import {
  Network,
  GitCommit,
  Layers,
  Wand2,
  Settings2,
  ChevronRight,
  Activity,
} from "lucide-react-native";

// Helper to map workflow types to icons and colors
const getTypeConfig = (type: string) => {
  switch (type) {
    case "BPMN_STANDARD":
      return { icon: Network, color: "#3b82f6", bg: "bg-blue-500/10" };
    case "SEQUENTIAL":
      return { icon: GitCommit, color: "#10b981", bg: "bg-emerald-500/10" };
    case "STATE_MACHINE":
      return { icon: Layers, color: "#a855f7", bg: "bg-purple-500/10" };
    case "AGENTIC_AI":
      return { icon: Wand2, color: "#f97316", bg: "bg-orange-500/10" };
    case "CONDITIONAL_RULES":
      return { icon: Settings2, color: "#f59e0b", bg: "bg-amber-500/10" };
    default:
      return { icon: Network, color: "#64748b", bg: "bg-slate-500/10" };
  }
};

export default function WorkflowsScreen() {
  const navigation = useNavigation<any>();
  const [page, setPage] = useState(1);
  const {
    data: response,
    isLoading,
    isFetching,
    refetch,
  } = useGetWorkflowsQuery({ page, limit: 10 });

  const workflows = response?.data || [];

  const renderItem = ({ item }: { item: any }) => {
    const config = getTypeConfig(item.type);
    const Icon = config.icon;

    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("WorkflowViewer", {
            id: item.id,
            name: item.name,
          })
        }
        className="bg-card border border-border rounded-3xl p-5 mb-4 shadow-sm"
      >
        <View className="flex-row items-center justify-between mb-3">
          <View
            className={`w-10 h-10 rounded-xl items-center justify-center ${config.bg}`}
          >
            <Icon size={20} color={config.color} />
          </View>
          <View className="bg-foreground/5 px-2 py-1 rounded-md">
            <Text className="text-[10px] font-bold text-foreground/50 uppercase tracking-widest">
              v{item.activeVersion || item.version || 1}
            </Text>
          </View>
        </View>

        <Text
          className="text-lg font-black text-foreground mb-1"
          numberOfLines={1}
        >
          {item.name}
        </Text>
        <Text className="text-xs font-bold text-foreground/40 uppercase tracking-widest mb-3">
          {item.type.replace("_", " ")}
        </Text>

        <Text
          className="text-xs text-foreground/60 leading-relaxed"
          numberOfLines={2}
        >
          {item.description || "No description provided for this architecture."}
        </Text>

        <View className="mt-4 pt-4 border-t border-border flex-row items-center justify-between">
          <Text className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest">
            ID: {item.id.split("-")[0]}
          </Text>
          <View className="flex-row items-center">
            <Text className="text-[10px] font-black text-primary uppercase tracking-widest mr-1">
              View Canvas
            </Text>
            <ChevronRight size={14} color="#f97316" />{" "}
            {/* Assuming primary is orange */}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-background px-4 pt-4">
      <View className="mb-6 flex-row items-center gap-2">
        <Activity size={24} color="#f97316" />
        <Text className="text-2xl font-black text-foreground">
          Orchestration Hub
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-xs font-bold text-foreground/50 uppercase tracking-widest mt-4">
            Syncing Architectures...
          </Text>
        </View>
      ) : (
        <FlatList
          data={workflows}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor="#f97316"
            />
          }
          ListEmptyComponent={
            <View className="items-center justify-center py-20">
              <Network size={48} color="#64748b" opacity={0.2} />
              <Text className="text-sm font-black text-foreground/40 uppercase tracking-widest mt-4">
                No Workflows Found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
