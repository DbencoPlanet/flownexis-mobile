import React, { useMemo } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { useGetWorkflowByIdQuery } from "../store/api/baseApi";
import {
  ArrowDown,
  Box,
  Settings2,
  User,
  Globe,
  GitBranch,
} from "lucide-react-native";

// Helper to determine node icons in the mobile viewer
const getNodeIcon = (type: string, taskType?: string) => {
  if (type === "gatewayNode") return <GitBranch size={16} color="#f59e0b" />;
  if (type === "userTaskNode") return <User size={16} color="#14b8a6" />;
  if (type === "serviceNode") return <Globe size={16} color="#3b82f6" />;
  return <Box size={16} color="#64748b" />;
};

export default function WorkflowViewerScreen() {
  const route = useRoute<any>();
  const { id } = route.params;

  const { data: response, isLoading } = useGetWorkflowByIdQuery(id);
  const workflow = response?.data;

  // Parse nodes and edges to create a vertical sequence
  const sequence = useMemo(() => {
    if (!workflow?.nodes || !workflow?.edges) return [];

    // Simplistic mobile topological sort: Find the start node, follow the edges
    const startNode = workflow.nodes.find(
      (n: any) => n.type === "eventNode" && n.data?.eventType === "start",
    );
    if (!startNode) return workflow.nodes; // Fallback: just list them if no clear start

    const orderedNodes = [];
    let currentId = startNode.id;
    const visited = new Set();

    while (currentId && !visited.has(currentId)) {
      const node = workflow.nodes.find((n: any) => n.id === currentId);
      if (node) {
        orderedNodes.push(node);
        visited.add(currentId);
      }
      // Find next node (assuming linear for mobile simplified view; complex forks will just show primary path)
      const nextEdge = workflow.edges.find((e: any) => e.source === currentId);
      currentId = nextEdge ? nextEdge.target : null;
    }

    // Append any unvisited nodes (like parallel forks) at the bottom
    workflow.nodes.forEach((n: any) => {
      if (!visited.has(n.id)) orderedNodes.push(n);
    });

    return orderedNodes;
  }, [workflow]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mt-4">
          Parsing Canvas Data...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header Info */}
      <View className="px-6 py-6 bg-card border-b border-border">
        <Text className="text-xl font-black text-foreground mb-1">
          {workflow?.name}
        </Text>
        <Text className="text-[10px] font-bold text-primary uppercase tracking-widest">
          Mobile Node Viewer • v{workflow?.currentVersion}
        </Text>
      </View>

      {/* Node Sequence List */}
      <ScrollView
        className="flex-1 px-6 pt-6"
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {sequence.map((node: any, index: number) => (
          <View key={node.id} className="items-center">
            {/* Node Card */}
            <View className="w-full bg-card border border-border p-5 rounded-3xl shadow-sm flex-row items-center gap-4">
              <View className="w-10 h-10 bg-foreground/5 rounded-full items-center justify-center border border-border/50">
                {getNodeIcon(node.type, node.data?.taskType)}
              </View>
              <View className="flex-1">
                <Text className="text-sm font-black text-foreground">
                  {node.data?.label || node.type}
                </Text>
                <Text className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">
                  {node.data?.taskType || node.type.replace("Node", "")}
                </Text>
              </View>
              {node.data?.assigneeRole && (
                <View className="bg-teal-500/10 px-2 py-1 rounded">
                  <Text className="text-[8px] font-black text-teal-600 uppercase">
                    {node.data.assigneeRole}
                  </Text>
                </View>
              )}
            </View>

            {/* Connecting Arrow (Don't render after the last item) */}
            {index < sequence.length - 1 && (
              <View className="py-2">
                <ArrowDown size={20} color="#cbd5e1" />
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
