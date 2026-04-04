import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "../theme/ThemeContext";

export default function NativeFormRenderer({ schema, onSubmit }: any) {
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {Object.entries(schema.properties).map(([key, field]: [string, any]) => (
        <View key={key} style={styles.fieldContainer}>
          <Text style={[styles.label, { color: colors.secondary }]}>
            {field.title || key}
          </Text>

          <Controller
            control={control}
            name={key}
            rules={{ required: field.required }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <View>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: colors.inputBg,
                      borderColor: error ? "#ef4444" : colors.border,
                      color: colors.foreground,
                    },
                  ]}
                  value={value}
                  onChangeText={onChange}
                  placeholder={field.description}
                  placeholderTextColor={colors.secondary}
                />
                {error && <Text style={styles.errorText}>Required field</Text>}
              </View>
            )}
          />
        </View>
      ))}

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: colors.primary }]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.submitText}>COMPLETE TASK</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  fieldContainer: { marginBottom: 20 },
  label: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 1,
  },
  input: {
    height: 60,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    fontWeight: "700",
  },
  submitBtn: {
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitText: { color: "#fff", fontWeight: "900", letterSpacing: 1 },
  errorText: {
    color: "#ef4444",
    fontSize: 10,
    fontWeight: "800",
    marginTop: 4,
  },
});
