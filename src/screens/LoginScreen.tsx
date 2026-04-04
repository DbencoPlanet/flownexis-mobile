import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../store/api/baseApi";
import { setCredentials } from "../store/slices/authSlice";
import { saveToken } from "../utils/auth";
import { Lock, Mail } from "lucide-react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("admin@flownexis.com");
  const [password, setPassword] = useState("Admin@123!");
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const result = await login({ email, password }).unwrap();
      await saveToken(result.data.accessToken);
      dispatch(setCredentials(result.data));
    } catch (err: any) {
      Alert.alert(
        "Login Failed",
        err.data?.error?.message || "Invalid credentials",
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FlowNexis</Text>
      <Text style={styles.subtitle}>Sign in to your enterprise account</Text>

      <View style={styles.inputGroup}>
        <Mail size={20} color="#64748b" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Lock size={20} color="#64748b" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Sign In</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 40,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#e2e8f0",
    borderWidth: 1, // FIXED: changed from borderWeight to borderWidth
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#0f172a",
  },
  button: {
    backgroundColor: "#2563eb",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
