import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { Alert } from "react-native";

export const useSocket = () => {
  const { user, token } = useSelector((state: any) => state.auth);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.tenantId || !token) return;

    // Use EXPO_PUBLIC_WS_URL from your .env
    const socketUrl = process.env.EXPO_PUBLIC_WS_URL || "http://your-ip:5000";

    socketRef.current = io(socketUrl, {
      query: { tenantId: user.tenantId },
      auth: { token },
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () =>
      console.log("📡 Mobile: Real-time link established"),
    );

    // Real-time Event: External Webhook Triggered
    socket.on("webhook_received", (data) => {
      Alert.alert(
        "External Trigger",
        `Workflow "${data.workflowName}" initiated via ${data.provider}.`,
      );
    });

    // Real-time Event: SLA Breach from BullMQ Worker
    socket.on("task_overdue", (data) => {
      Alert.alert(
        "⚠️ SLA ALERT",
        `Task "${data.label}" is now overdue and requires immediate attention.`,
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.tenantId, token]);

  return socketRef.current;
};
