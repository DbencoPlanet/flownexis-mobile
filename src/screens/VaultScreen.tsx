import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Use this for headers
import { useStoreVaultSecretMutation } from "../store/api/baseApi";
import { Lock, ShieldCheck, Key, Plus, Loader2 } from "lucide-react-native";
import { useTheme } from "../theme/ThemeContext";

export default function VaultScreen() {
  const { colors } = useTheme();
  const [storeSecret, { isLoading }] = useStoreVaultSecretMutation();
  const [form, setForm] = useState({ keyName: "", value: "" });

  const handleVault = async () => {
    if (!form.keyName || !form.value) return;
    try {
      await storeSecret(form).unwrap();
      Alert.alert(
        "Success",
        `${form.keyName} is now cryptographically secured.`,
      );
      setForm({ keyName: "", value: "" });
    } catch (err) {
      Alert.alert("Error", "Vault encryption failure.");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView>
        <View style={[styles.header, { backgroundColor: "#0f172a" }]}>
          <ShieldCheck color="#3b82f6" size={40} />
          <Text style={styles.title}>AES-256 Vault</Text>
          <Text style={styles.subtitle}>Mobile Security Terminal</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.secondary }]}>
              Secret Key Name
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <Key
                size={18}
                color={colors.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="e.g. AWS_SECRET_KEY"
                placeholderTextColor={colors.secondary}
                value={form.keyName}
                onChangeText={(val) =>
                  setForm({ ...form, keyName: val.toUpperCase() })
                }
                autoCapitalize="characters"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.secondary }]}>
              Secret Value
            </Text>
            <View
              style={[
                styles.inputWrapper,
                { backgroundColor: colors.inputBg, borderColor: colors.border },
              ]}
            >
              <Lock
                size={18}
                color={colors.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: colors.foreground }]}
                placeholder="••••••••••••"
                secureTextEntry
                placeholderTextColor={colors.secondary}
                value={form.value}
                onChangeText={(val) => setForm({ ...form, value: val })}
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleVault}
            disabled={isLoading}
            style={[styles.button, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.buttonText}>COMMIT TO VAULT</Text>
            {isLoading && (
              <Loader2 color="#fff" size={16} style={{ marginLeft: 8 }} />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 40,
    alignItems: "center",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: { color: "#fff", fontSize: 24, fontWeight: "900", marginTop: 12 },
  subtitle: {
    color: "#3b82f6",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginTop: 4,
  },
  form: { padding: 24, marginTop: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 10, fontWeight: "900", marginBottom: 8, letterSpacing: 1 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 60,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 14, fontWeight: "700" },
  button: {
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1.5,
  },
});
