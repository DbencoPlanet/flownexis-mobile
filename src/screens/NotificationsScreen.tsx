import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from "react-native";
import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
} from "../store/api/baseApi";
import { Bell, Clock, Workflow, Info, CheckCheck } from "lucide-react-native";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsScreen({ navigation }: any) {
  const {
    data: notifRes,
    isLoading,
    refetch,
  } = useGetNotificationsQuery(undefined);
  const [markAsRead] = useMarkNotificationReadMutation();

  const notifications = notifRes?.data || [];

  const handlePress = async (notif: any) => {
    await markAsRead(notif.id);
    if (notif.link) {
      // Deep link logic to Task or Execution
      navigation.navigate("TaskDetails", {
        taskId: notif.link.split("/").pop(),
      });
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => handlePress(item)}
      style={[styles.notifCard, !item.isRead && styles.unreadCard]}
    >
      <View
        style={[
          styles.iconContainer,
          item.isRead ? styles.readIcon : styles.unreadIcon,
        ]}
      >
        {item.type === "WORKFLOW" ? (
          <Workflow size={18} color={item.isRead ? "#94a3b8" : "#3b82f6"} />
        ) : (
          <Info size={18} color="#3b82f6" />
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {item.message}
        </Text>
        <Text style={styles.time}>
          <Clock size={10} color="#94a3b8" />{" "}
          {formatDistanceToNow(new Date(item.createdAt))} ago
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor="#3b82f6"
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Bell size={48} color="#e2e8f0" />
            <Text style={styles.emptyText}>Protocol Comms Silent</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  notifCard: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  unreadCard: { backgroundColor: "#f0f7ff" },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  unreadIcon: { backgroundColor: "#dbeafe" },
  readIcon: { backgroundColor: "#f1f5f9" },
  content: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: { fontSize: 14, fontWeight: "800", color: "#1e293b" },
  message: { fontSize: 12, color: "#64748b", lineHeight: 18 },
  time: { fontSize: 10, color: "#94a3b8", marginTop: 8 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3b82f6",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 12,
    fontWeight: "900",
    color: "#cbd5e1",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
