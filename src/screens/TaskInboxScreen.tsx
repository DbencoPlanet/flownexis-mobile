import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useGetMyTasksQuery } from "../store/api/baseApi";
import { useTheme } from "../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Inbox, Clock, ChevronRight } from "lucide-react-native";

export default function TaskInboxScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: response,
    isLoading,
    refetch,
    isFetching,
  } = useGetMyTasksQuery();
  const tasks = response?.data || [];

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("TaskDetails", { taskId: item.id })}
      className="mb-3 p-4 rounded-2xl border"
      style={{ backgroundColor: colors.card, borderColor: colors.border }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <Text
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ color: colors.primary }}
        >
          {item.workflow?.name || "Workflow"}
        </Text>
        <View className="px-2 py-1 rounded-md bg-amber-500/10">
          <Text className="text-[9px] font-black uppercase tracking-widest text-amber-500">
            {item.status}
          </Text>
        </View>
      </View>

      <Text
        className="text-sm font-black mb-3"
        style={{ color: colors.foreground }}
      >
        {item.label}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Clock size={12} color={colors.secondary} />
          <Text
            className="text-[10px] font-bold ml-1"
            style={{ color: colors.secondary }}
          >
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.background, paddingTop: insets.top }}
    >
      <View
        className="px-6 py-4 border-b"
        style={{ borderColor: colors.border, backgroundColor: colors.card }}
      >
        <Text
          className="text-2xl font-black tracking-tight"
          style={{ color: colors.foreground }}
        >
          My Approvals
        </Text>
        <Text
          className="text-xs font-bold uppercase tracking-widest mt-1"
          style={{ color: colors.secondary }}
        >
          {tasks.length} Pending Actions
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : tasks.length === 0 ? (
        <View className="flex-1 justify-center items-center opacity-30">
          <Inbox size={48} color={colors.foreground} className="mb-4" />
          <Text
            className="text-xs font-black uppercase tracking-widest"
            style={{ color: colors.foreground }}
          >
            Inbox Zero
          </Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={isFetching}
              onRefresh={refetch}
              tintColor={colors.primary}
            />
          }
        />
      )}
    </View>
  );
}

// import React from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { useGetDashboardStatsQuery } from "../store/api/baseApi"; // Replace with useGetTasksQuery
// import { useTheme } from "../theme/ThemeContext";
// import { ChevronRight, Clock, AlertCircle } from "lucide-react-native";

// export default function TaskInboxScreen({ navigation }: any) {
//   const { colors } = useTheme();

//   // Example live tasks
//   const tasks = [
//     {
//       id: "1",
//       title: "Approve Expense Claim",
//       type: "APPROVAL_GATE",
//       priority: "HIGH",
//     },
//     {
//       id: "2",
//       title: "Upload ID Verification",
//       type: "FILE_UPLOAD",
//       priority: "MEDIUM",
//     },
//   ];

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <FlatList
//         data={tasks}
//         contentContainerStyle={{ padding: 20 }}
//         renderItem={({ item }) => (
//           <TouchableOpacity
//             style={[
//               styles.card,
//               { backgroundColor: colors.card, borderColor: colors.border },
//             ]}
//             onPress={() =>
//               navigation.navigate("FormEntry", { taskId: item.id })
//             }
//           >
//             <View style={styles.cardInfo}>
//               <Text style={[styles.title, { color: colors.foreground }]}>
//                 {item.title}
//               </Text>
//               <View style={styles.meta}>
//                 <Clock size={12} color={colors.secondary} />
//                 <Text style={[styles.metaText, { color: colors.secondary }]}>
//                   {item.type}
//                 </Text>
//               </View>
//             </View>
//             <View
//               style={[
//                 styles.badge,
//                 {
//                   backgroundColor:
//                     item.priority === "HIGH" ? "#fee2e2" : "#f0f9ff",
//                 },
//               ]}
//             >
//               <Text
//                 style={{
//                   fontSize: 8,
//                   fontWeight: "900",
//                   color: item.priority === "HIGH" ? "#ef4444" : "#0ea5e9",
//                 }}
//               >
//                 {item.priority}
//               </Text>
//             </View>
//             <ChevronRight size={18} color={colors.border} />
//           </TouchableOpacity>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 20,
//     borderRadius: 24,
//     borderWidth: 1,
//     marginBottom: 12,
//   },
//   cardInfo: { flex: 1 },
//   title: { fontSize: 16, fontWeight: "800", marginBottom: 4 },
//   meta: { flexDirection: "row", alignItems: "center", gap: 6 },
//   metaText: { fontSize: 10, fontWeight: "700" },
//   badge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//     marginRight: 10,
//   },
// });
