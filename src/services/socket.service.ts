import { io, Socket } from "socket.io-client";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

class MobileSocketService {
  public socket: Socket | null = null;

  /**
   * Connects to the Real-time Hub with Tenant Context and Auth Token
   */
  connect(tenantId: string, token: string) {
    if (this.socket) return;

    // Pull from env or fallback to local ip (Replace with your machine IP for physical devices)
    const socketUrl = process.env.EXPO_PUBLIC_WS_URL || "http://localhost:5000";

    this.socket = io(socketUrl, {
      query: { tenantId },
      auth: { token }, // 🚨 CRITICAL: Matches backend authenticate middleware
      transports: ["websocket"],
    });

    this.socket.on("connect", () => {
      console.log("📱 Mobile: Connected to FlowNexis Real-time Hub");
    });

    // 1. Listen for SLA Breaches (BullMQ Worker Event)
    this.socket.on("task_overdue", async (data) => {
      console.warn(`⚠️ SLA BREACH: ${data.label}`);
      await this.triggerLocalNotification(
        "🚨 SLA Breach Alert",
        `Task "${data.label}" is past its due date and has been escalated.`,
      );
    });

    // 2. Listen for Inbound Webhooks (Integration Controller Event)
    this.socket.on("webhook_received", async (data) => {
      await this.triggerLocalNotification(
        "⚡ Webhook Triggered",
        `${data.provider} initiated workflow: ${data.workflowName}`,
      );
    });

    this.socket.on("disconnect", () => {
      console.log("🔌 Mobile: Socket disconnected.");
    });
  }

  /**
   * Helper to fire off an OS-level notification
   */
  private async triggerLocalNotification(title: string, body: string) {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: "default",
        },
        trigger: null, // Send immediately
      });
    } catch (err) {
      console.error("Failed to trigger local notification:", err);
    }
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new MobileSocketService();
