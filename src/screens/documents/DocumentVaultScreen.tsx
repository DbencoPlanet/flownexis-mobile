"use client";

import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from "react-native";
import { useGetDocumentsQuery } from "../../store/api/baseApi";
import {
  FileText,
  ExternalLink,
  HardDrive,
  Calendar,
  ShieldCheck,
  GitBranch,
} from "lucide-react-native";
import { useTheme } from "../../theme/ThemeContext";

export default function DocumentVaultScreen() {
  const { colors } = useTheme();
  const { data: response, isLoading, refetch } = useGetDocumentsQuery({});
  const documents = response?.data || [];

  const openPdf = (item: any) => {
    if (item.status !== "COMPLETED")
      return alert("Asset generation in progress.");
    Linking.openURL(item.fileUrl).catch(console.error);
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => openPdf(item)}
      style={[
        styles.docItem,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.iconBox,
          {
            backgroundColor:
              item.status === "COMPLETED" ? "#22c55e10" : "#f59e0b10",
          },
        ]}
      >
        <FileText
          size={22}
          color={item.status === "COMPLETED" ? "#22c55e" : "#f59e0b"}
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={[styles.docName, { color: colors.text }]}>
          {item.name}
        </Text>
        <View style={styles.metaRow}>
          <ShieldCheck size={10} color={colors.text + "60"} />
          <Text style={[styles.docMeta, { color: colors.text + "60" }]}>
            {item.template?.name || "Manual"}
          </Text>
        </View>
        {item.executionId && (
          <View style={styles.metaRow}>
            <GitBranch size={10} color={colors.primary} />
            <Text style={[styles.docMeta, { color: colors.primary }]}>
              Run: {item.executionId.slice(0, 8)}
            </Text>
          </View>
        )}
      </View>

      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor:
              item.status === "COMPLETED" ? "#22c55e" : "#f59e0b",
          },
        ]}
      >
        <Text style={styles.statusText}>{item.status.charAt(0)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.titleIcon, { backgroundColor: colors.primary }]}>
          <HardDrive size={24} color="#FFF" />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>ASSET VAULT</Text>
      </View>

      <FlatList
        data={documents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshing={isLoading}
        onRefresh={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 30, alignItems: "center", paddingTop: 60 },
  titleIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 22, fontWeight: "900", letterSpacing: -1 },
  list: { padding: 20, gap: 12 },
  docItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 25,
    borderWidth: 1.5,
    gap: 15,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  docName: { fontSize: 14, fontWeight: "900", marginBottom: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  docMeta: { fontSize: 10, fontWeight: "800", textTransform: "uppercase" },
  statusBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: { fontSize: 8, fontWeight: "900", color: "#FFF" },
});

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TouchableOpacity,
//   StyleSheet,
//   Linking,
//   TextInput,
//   ActivityIndicator,
// } from "react-native";
// import { useGetDocumentsQuery } from "../../store/api/baseApi";
// import {
//   FileText,
//   ExternalLink,
//   HardDrive,
//   Calendar,
//   Search,
//   User,
//   AlertCircle,
// } from "lucide-react-native";
// import { useTheme } from "../../theme/ThemeContext";

// export default function DocumentVaultScreen() {
//   const { colors } = useTheme();
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);

//   // 1. Fetching with Search and Pagination params
//   const {
//     data: response,
//     isLoading,
//     isFetching,
//     refetch,
//   } = useGetDocumentsQuery({
//     ...(search && { search }),
//     page,
//     limit: 20,
//   });

//   const documents = response?.data || [];

//   const openPdf = (url: string, status: string) => {
//     if (status !== "COMPLETED") {
//       alert("Document is still generating. Please wait.");
//       return;
//     }
//     if (!url) return;
//     Linking.openURL(url).catch((err) =>
//       console.error("Couldn't load PDF", err),
//     );
//   };

//   const renderItem = ({ item }: any) => (
//     <TouchableOpacity
//       onPress={() => openPdf(item.fileUrl, item.status)}
//       style={[
//         styles.docItem,
//         { backgroundColor: colors.card, borderColor: colors.border },
//       ]}
//     >
//       <View
//         style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}
//       >
//         <FileText size={22} color={colors.primary} />
//       </View>

//       <View style={{ flex: 1 }}>
//         <View style={styles.nameRow}>
//           <Text
//             style={[styles.docName, { color: colors.text }]}
//             numberOfLines={1}
//           >
//             {item.name}
//           </Text>
//           {/* Status Badge */}
//           <View
//             style={[
//               styles.statusBadge,
//               {
//                 backgroundColor:
//                   item.status === "COMPLETED" ? "#22c55e20" : "#f59e0b20",
//               },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.statusText,
//                 { color: item.status === "COMPLETED" ? "#22c55e" : "#f59e0b" },
//               ]}
//             >
//               {item.status}
//             </Text>
//           </View>
//         </View>

//         <View style={styles.metaRow}>
//           <Calendar size={10} color={colors.text + "60"} />
//           <Text style={[styles.docMeta, { color: colors.text + "60" }]}>
//             {new Date(item.createdAt).toLocaleDateString()} •{" "}
//             {item.template?.name || "System"}
//           </Text>
//         </View>

//         <View style={styles.custodianRow}>
//           <User size={10} color={colors.primary} />
//           <Text style={[styles.custodianName, { color: colors.text + "80" }]}>
//             {item.generatedBy?.fullName || "System User"}
//           </Text>
//         </View>
//       </View>

//       <ExternalLink size={18} color={colors.text + "30"} />
//     </TouchableOpacity>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       {/* HEADER SECTION */}
//       <View style={styles.header}>
//         <View style={styles.titleRow}>
//           <View style={[styles.titleIcon, { backgroundColor: colors.primary }]}>
//             <HardDrive size={20} color="#FFF" />
//           </View>
//           <View>
//             <Text style={[styles.title, { color: colors.text }]}>VAULT</Text>
//             <Text style={[styles.subtitle, { color: colors.text + "40" }]}>
//               Anchored Assets
//             </Text>
//           </View>
//         </View>

//         {/* SEARCH INPUT */}
//         <View
//           style={[
//             styles.searchContainer,
//             { backgroundColor: colors.card, borderColor: colors.border },
//           ]}
//         >
//           <Search size={18} color={colors.text + "40"} />
//           <TextInput
//             placeholder="Search assets..."
//             placeholderTextColor={colors.text + "40"}
//             style={[styles.searchInput, { color: colors.text }]}
//             value={search}
//             onChangeText={(text) => {
//               setSearch(text);
//               setPage(1);
//             }}
//           />
//           {isFetching && (
//             <ActivityIndicator size="small" color={colors.primary} />
//           )}
//         </View>
//       </View>

//       <FlatList
//         data={documents}
//         renderItem={renderItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.list}
//         refreshing={isLoading}
//         onRefresh={refetch}
//         ListEmptyComponent={
//           <View style={styles.emptyBox}>
//             <AlertCircle size={40} color={colors.text + "20"} />
//             <Text style={[styles.empty, { color: colors.text + "30" }]}>
//               No assets found in vault.
//             </Text>
//           </View>
//         }
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 20 },
//   titleRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 12,
//     marginBottom: 20,
//   },
//   titleIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   title: { fontSize: 24, fontWeight: "900", letterSpacing: -1 },
//   subtitle: {
//     fontSize: 9,
//     fontWeight: "800",
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
//   searchContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: 15,
//     height: 50,
//     borderRadius: 15,
//     borderWidth: 1,
//     gap: 10,
//   },
//   searchInput: { flex: 1, fontWeight: "700", fontSize: 14 },
//   list: { padding: 20, paddingBottom: 100 },
//   docItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 18,
//     borderRadius: 25,
//     borderWidth: 1.5,
//     gap: 15,
//     marginBottom: 12,
//   },
//   iconBox: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   nameRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   docName: { fontSize: 14, fontWeight: "900", flex: 1, marginRight: 10 },
//   statusBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: 8,
//   },
//   statusText: { fontSize: 8, fontWeight: "900", textTransform: "uppercase" },
//   metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
//   docMeta: { fontSize: 10, fontWeight: "bold" },
//   custodianRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 5,
//     marginTop: 6,
//   },
//   custodianName: { fontSize: 10, fontWeight: "800" },
//   emptyBox: { alignItems: "center", marginTop: 100 },
//   empty: {
//     textAlign: "center",
//     marginTop: 15,
//     fontWeight: "900",
//     fontSize: 12,
//     textTransform: "uppercase",
//     letterSpacing: 1,
//   },
// });
