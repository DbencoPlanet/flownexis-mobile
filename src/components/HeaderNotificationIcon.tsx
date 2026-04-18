import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Bell } from "lucide-react-native";
import { useGetNotificationsQuery } from "../store/api/baseApi";
import { useTheme } from "../theme/ThemeContext";

export default function HeaderNotificationIcon() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  // 🔄 Real-time data sync with Slice 11 backend
  const { data: notifRes } = useGetNotificationsQuery(undefined, {
    pollingInterval: 15000,
  });

  const unreadCount = useMemo(
    () => notifRes?.data?.filter((n: any) => !n.isRead).length || 0,
    [notifRes],
  );

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Notifications")}
      style={styles.container}
    >
      <Bell color={colors.foreground} size={22} />
      {unreadCount > 0 && (
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { marginRight: 15, padding: 5 },
  badge: {
    position: "absolute",
    right: 0,
    top: 0,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  badgeText: { color: "white", fontSize: 8, fontWeight: "900" },
});
