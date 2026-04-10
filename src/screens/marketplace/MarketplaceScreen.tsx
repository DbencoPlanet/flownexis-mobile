"use client";

import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import {
  useGetTemplatesQuery,
  useGetTemplateCategoriesQuery,
  useForgeTemplateMutation,
} from "../../store/api/baseApi";
import {
  ShoppingBag,
  Search,
  FileText,
  Zap,
  LayoutGrid,
} from "lucide-react-native";
import { useTheme } from "../../theme/ThemeContext";

export default function MarketplaceScreen() {
  const { colors } = useTheme();
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState<string | null>(null);

  // 1. Data Hooks
  const { data: catRes } = useGetTemplateCategoriesQuery();
  const {
    data: tplRes,
    isLoading,
    isFetching,
  } = useGetTemplatesQuery({
    marketplace: true,
    ...(search && { search }),
    ...(selectedCat && { categoryId: selectedCat }),
  });

  const [forgeTemplate, { isLoading: isForging }] = useForgeTemplateMutation();

  const categories = catRes?.data || [];
  const templates = tplRes?.data || [];

  // 2. Action: Forge (Clone) Protocol
  const handleForge = async (id: string, name: string) => {
    try {
      await forgeTemplate(id).unwrap();
      Alert.alert(
        "Forge Successful",
        `${name} has been synchronized to your private library.`,
      );
    } catch (err: any) {
      Alert.alert(
        "Forge Failed",
        err?.data?.message || "Check your tier limits.",
      );
    }
  };

  const renderTemplate = ({ item }: any) => (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.cardHeader}>
        <View
          style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}
        >
          <FileText size={20} color={colors.primary} />
        </View>
        <View
          style={[styles.badge, { backgroundColor: colors.foreground + "05" }]}
        >
          <Text style={[styles.badgeText, { color: colors.text }]}>
            {item.category?.name || "Utility"}
          </Text>
        </View>
      </View>

      <Text style={[styles.tplName, { color: colors.text }]}>{item.name}</Text>
      <Text
        style={[styles.tplDesc, { color: colors.text + "70" }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.priceLabel, { color: colors.text + "40" }]}>
            VALUATION
          </Text>
          <Text style={[styles.price, { color: colors.primary }]}>
            {item.price > 0 ? `$${item.price}` : "FREE"}
          </Text>
        </View>

        <TouchableOpacity
          disabled={isForging}
          onPress={() => handleForge(item.id, item.name)}
          style={[styles.btn, { backgroundColor: colors.text }]}
        >
          {isForging ? (
            <ActivityIndicator size="small" color={colors.background} />
          ) : (
            <Zap size={18} color={colors.background} fill={colors.background} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER & SEARCH */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <ShoppingBag size={24} color={colors.primary} />
          <Text style={[styles.title, { color: colors.text }]}>
            MARKETPLACE
          </Text>
        </View>

        <View
          style={[
            styles.searchBar,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Search size={18} color={colors.text + "40"} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            placeholder="Search blueprints..."
            placeholderTextColor={colors.text + "40"}
            value={search}
            onChangeText={setSearch}
          />
          {isFetching && (
            <ActivityIndicator size="small" color={colors.primary} />
          )}
        </View>
      </View>

      {/* CATEGORY FILTERS */}
      <View style={styles.catWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.catScroll}
        >
          <TouchableOpacity
            onPress={() => setSelectedCat(null)}
            style={[
              styles.catBtn,
              !selectedCat
                ? { backgroundColor: colors.primary }
                : {
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                  },
            ]}
          >
            <Text
              style={[
                styles.catLabel,
                !selectedCat
                  ? { color: "#FFF" }
                  : { color: colors.text + "60" },
              ]}
            >
              ALL
            </Text>
          </TouchableOpacity>
          {categories.map((cat: any) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCat(cat.id)}
              style={[
                styles.catBtn,
                selectedCat === cat.id
                  ? { backgroundColor: colors.primary }
                  : {
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
              ]}
            >
              <Text
                style={[
                  styles.catLabel,
                  selectedCat === cat.id
                    ? { color: "#FFF" }
                    : { color: colors.text + "60" },
                ]}
              >
                {cat.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.text + "40" }]}>
            SYNCING REPOSITORY...
          </Text>
        </View>
      ) : (
        <FlatList
          data={templates}
          renderItem={renderTemplate}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.center}>
              <LayoutGrid size={40} color={colors.text + "20"} />
              <Text style={[styles.empty, { color: colors.text + "40" }]}>
                No blueprints found in this domain.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 20 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  title: { fontSize: 28, fontWeight: "900", letterSpacing: -1 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 18,
    borderWidth: 1,
    height: 55,
    gap: 10,
  },
  input: { flex: 1, fontWeight: "700", fontSize: 14 },
  catWrapper: { marginBottom: 15 },
  catScroll: { paddingHorizontal: 25, gap: 10 },
  catBtn: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 14,
  },
  catLabel: { fontSize: 10, fontWeight: "900", letterSpacing: 1 },
  list: { paddingHorizontal: 25, paddingBottom: 100 },
  card: {
    padding: 25,
    borderRadius: 30,
    borderWidth: 2,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgeText: { fontSize: 9, fontWeight: "900", letterSpacing: 0.5 },
  tplName: {
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  tplDesc: {
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
    marginBottom: 25,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    borderTopWidth: 1.5,
  },
  priceLabel: { fontSize: 8, fontWeight: "900", marginBottom: 2 },
  price: { fontSize: 18, fontWeight: "900" },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
  loadingText: {
    fontSize: 9,
    fontWeight: "900",
    marginTop: 15,
    letterSpacing: 2,
  },
  empty: {
    textAlign: "center",
    marginTop: 15,
    fontWeight: "900",
    fontSize: 12,
    textTransform: "uppercase",
  },
});
