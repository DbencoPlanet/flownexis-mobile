import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Clipboard,
} from "react-native";
import {
  ShieldCheck,
  Lock,
  Trash2,
  Zap,
  Globe,
  Copy,
  Activity,
} from "lucide-react-native";
import {
  useGetIntegrationsQuery,
  useStoreintegrationVaultSecretMutation,
  useDeleteIntegrationMutation,
  useGetJobHistoryQuery,
} from "../store/api/baseApi";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function IntegrationsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [keyName, setKeyName] = useState("");
  const [secretValue, setSecretValue] = useState("");

  const { data: vaultRes, isLoading: vLoading } = useGetIntegrationsQuery();
  const { data: jobsRes } = useGetJobHistoryQuery(undefined, {
    pollingInterval: 5000,
  });
  const [storeSecret, { isLoading: isStoring }] =
    useStoreintegrationVaultSecretMutation();
  const [deleteSecret] = useDeleteIntegrationMutation();

  const webhookUrl = `${process.env.EXPO_PUBLIC_API_URL}/webhooks/receive/generic?tenantId=${user?.tenantId}`;

  const handleVault = async () => {
    try {
      await storeSecret({ keyName, secretValue }).unwrap();
      Alert.alert("Success", "Credential encrypted and vaulted.");
      setKeyName("");
      setSecretValue("");
    } catch (err) {
      Alert.alert("Error", "Vaulting failed.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50 dark:bg-black p-5">
      {/* 1. WEBHOOK INGRESS */}
      <View className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-6">
        <View className="flex-row items-center mb-3">
          <Globe size={18} color="#6366f1" />
          <Text className="font-black text-lg ml-2 dark:text-white">
            Webhook Ingress
          </Text>
        </View>
        <Text className="text-[10px] text-slate-500 font-bold uppercase mb-3">
          External Trigger URL
        </Text>
        <TouchableOpacity
          onPress={() => {
            Clipboard.setString(webhookUrl);
            Alert.alert("Copied");
          }}
          className="bg-slate-50 dark:bg-black p-4 rounded-xl flex-row justify-between items-center"
        >
          <Text
            numberOfLines={1}
            className="text-[10px] font-mono text-blue-500 flex-1 mr-2"
          >
            {webhookUrl}
          </Text>
          <Copy size={14} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      {/* 2. JOB TELEMETRY (BullMQ) */}
      <View className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 mb-6">
        <View className="flex-row items-center mb-4">
          <Activity size={18} color="#10b981" />
          <Text className="font-black text-lg ml-2 dark:text-white">
            Background Status
          </Text>
        </View>
        {jobsRes?.data?.slice(0, 3).map((job: any) => (
          <View
            key={job.id}
            className="flex-row justify-between items-center mb-3 border-b border-slate-50 dark:border-slate-800 pb-2"
          >
            <Text className="text-[10px] font-black font-mono dark:text-white">
              {job.name}
            </Text>
            <View
              className={`px-2 py-1 rounded-full ${job.status === "completed" ? "bg-emerald-100" : "bg-amber-100"}`}
            >
              <Text className="text-[8px] font-black uppercase text-emerald-700">
                {job.status}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* 3. VAULT ENTRY */}
      <View className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm mb-8 border border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center mb-4 gap-2">
          <Lock size={18} color="#3b82f6" />
          <Text className="font-black text-lg dark:text-white">
            Secure Vault
          </Text>
        </View>
        <TextInput
          placeholder="KEY_NAME"
          value={keyName}
          onChangeText={(t) => setKeyName(t.toUpperCase())}
          className="bg-slate-50 dark:bg-black p-4 rounded-xl font-bold mb-3 dark:text-white"
        />
        <TextInput
          placeholder="Value"
          value={secretValue}
          onChangeText={setSecretValue}
          secureTextEntry
          className="bg-slate-50 dark:bg-black p-4 rounded-xl font-bold mb-4 dark:text-white"
        />
        <TouchableOpacity
          onPress={handleVault}
          disabled={isStoring}
          className="bg-blue-600 p-4 rounded-xl items-center"
        >
          {isStoring ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black uppercase tracking-widest text-xs">
              Encrypt & Vault
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
// } from "react-native";
// import {
//   ShieldCheck,
//   Lock,
//   Trash2,
//   Zap,
//   RefreshCw,
//   Key,
// } from "lucide-react-native";
// import {
//   useGetIntegrationsQuery,
//   useStoreintegrationVaultSecretMutation,
//   useDeleteIntegrationMutation,
//   useTriggerManualJobMutation,
// } from "../store/api/baseApi";
// import { useSocket } from "../hooks/useSocket";

// export default function IntegrationsScreen() {
//   useSocket(); // Initialize listeners
//   const [keyName, setKeyName] = useState("");
//   const [secretValue, setSecretValue] = useState("");

//   const { data: integrations, isLoading } = useGetIntegrationsQuery();
//   const [storeSecret, { isLoading: isStoring }] =
//     useStoreintegrationVaultSecretMutation();
//   const [deleteSecret] = useDeleteIntegrationMutation();
//   const [triggerJob, { isLoading: isTriggering }] =
//     useTriggerManualJobMutation();

//   const handleVaultSubmit = async () => {
//     try {
//       await storeSecret({ keyName, secretValue }).unwrap();
//       Alert.alert("Success", "Credential encrypted and vaulted.");
//       setKeyName("");
//       setSecretValue("");
//     } catch (err) {
//       Alert.alert("Error", "Vaulting failed.");
//     }
//   };

//   const runArchiver = async () => {
//     try {
//       await triggerJob({
//         jobName: "ARCHIVE_OLD_EXECUTIONS",
//         data: {},
//       }).unwrap();
//       Alert.alert("Job Enqueued", "Archival process started in background.");
//     } catch (err) {
//       Alert.alert("Error", "Trigger failed.");
//     }
//   };

//   return (
//     <ScrollView className="flex-1 bg-slate-50 dark:bg-black p-5">
//       <View className="flex-row justify-between items-center mb-8">
//         <Text className="text-3xl font-black tracking-tighter dark:text-white uppercase">
//           Integrations
//         </Text>
//         <TouchableOpacity
//           onPress={runArchiver}
//           className="bg-amber-100 p-2 rounded-full"
//         >
//           <RefreshCw
//             size={20}
//             color="#d97706"
//             className={isTriggering ? "animate-spin" : ""}
//           />
//         </TouchableOpacity>
//       </View>

//       {/* Vault Form */}
//       <View className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-sm mb-8 border border-slate-100 dark:border-slate-800">
//         <View className="flex-row items-center mb-4 gap-2">
//           <Lock size={18} color="#3b82f6" />
//           <Text className="font-black text-lg dark:text-white">
//             Secure Vault
//           </Text>
//         </View>

//         <TextInput
//           placeholder="PROVIDER_KEY"
//           value={keyName}
//           onChangeText={(t) => setKeyName(t.toUpperCase())}
//           className="bg-slate-50 dark:bg-black p-4 rounded-xl font-bold mb-3 dark:text-white"
//         />
//         <TextInput
//           placeholder="Secret Value"
//           value={secretValue}
//           onChangeText={setSecretValue}
//           secureTextEntry
//           className="bg-slate-50 dark:bg-black p-4 rounded-xl font-bold mb-4 dark:text-white"
//         />

//         <TouchableOpacity
//           onPress={handleVaultSubmit}
//           disabled={isStoring || !keyName || !secretValue}
//           className="bg-blue-600 p-4 rounded-xl items-center"
//         >
//           {isStoring ? (
//             <ActivityIndicator color="white" />
//           ) : (
//             <Text className="text-white font-black uppercase tracking-widest">
//               Vault Secret
//             </Text>
//           )}
//         </TouchableOpacity>
//       </View>

//       {/* Active Integrations */}
//       <Text className="text-lg font-black mb-4 dark:text-white">
//         Active Registry
//       </Text>
//       {isLoading ? (
//         <ActivityIndicator size="large" />
//       ) : (
//         integrations?.data?.map((item: any) => (
//           <View
//             key={item.id}
//             className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 mb-3 flex-row justify-between items-center"
//           >
//             <View className="flex-row items-center gap-3">
//               <View className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg">
//                 <Zap size={18} color="#3b82f6" fill="#3b82f6" />
//               </View>
//               <View>
//                 <Text className="font-black dark:text-white">
//                   {item.keyName}
//                 </Text>
//                 <Text className="text-[10px] font-bold text-slate-400 uppercase">
//                   AES-256 Locked
//                 </Text>
//               </View>
//             </View>
//             <TouchableOpacity onPress={() => deleteSecret(item.id)}>
//               <Trash2 size={18} color="#ef4444" />
//             </TouchableOpacity>
//           </View>
//         ))
//       )}
//     </ScrollView>
//   );
// }
