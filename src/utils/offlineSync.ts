import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

const QUEUE_KEY = "@form_submission_queue";

export const queueFormSubmission = async (formId: string, data: any) => {
  const existingQueue = JSON.parse(
    (await AsyncStorage.getItem(QUEUE_KEY)) || "[]",
  );
  const newEntry = { formId, data, timestamp: Date.now() };

  await AsyncStorage.setItem(
    QUEUE_KEY,
    JSON.stringify([...existingQueue, newEntry]),
  );

  // Attempt sync immediately if network is available
  const state = await NetInfo.fetch();
  if (state.isConnected) {
    processQueue();
  }
};

export const processQueue = async () => {
  const queue = JSON.parse((await AsyncStorage.getItem(QUEUE_KEY)) || "[]");
  if (queue.length === 0) return;

  console.log(`Syncing ${queue.length} offline submissions...`);
  // Map through queue and call POST /forms/:id/submit
  // On success, remove from AsyncStorage
};
