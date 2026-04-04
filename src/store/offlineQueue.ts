import AsyncStorage from "@react-native-async-storage/async-storage";

export const queueMutation = async (type: "SUBMIT" | "DRAFT", payload: any) => {
  const queue = JSON.parse(
    (await AsyncStorage.getItem("OFFLINE_QUEUE")) || "[]",
  );
  queue.push({ id: Date.now(), type, payload, timestamp: new Date() });
  await AsyncStorage.setItem("OFFLINE_QUEUE", JSON.stringify(queue));
};

export const syncQueueWithBackend = async (apiClient: any) => {
  const queue = JSON.parse(
    (await AsyncStorage.getItem("OFFLINE_QUEUE")) || "[]",
  );
  if (queue.length === 0) return;

  for (const item of queue) {
    try {
      if (item.type === "SUBMIT") {
        await apiClient.submitForm(item.payload);
      }
      // Remove item from queue after successful sync
    } catch (e) {
      console.log("Sync failed, will retry later");
    }
  }
};
