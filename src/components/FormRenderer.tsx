import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useTheme } from "../theme/ThemeContext";

export default function FormRenderer({ schema, onSubmit }: any) {
  const { colors } = useTheme();
  const { control, handleSubmit } = useForm();

  return (
    <View style={styles.container}>
      {Object.entries(schema.properties).map(([key, field]: [string, any]) => (
        <View key={key} style={styles.fieldWrapper}>
          <Text style={[styles.label, { color: colors.primary }]}>
            {field.title || key}
          </Text>
          <Controller
            control={control}
            name={key}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.inputBg,
                    color: colors.foreground,
                    borderColor: colors.border,
                  },
                ]}
                onChangeText={onChange}
                value={value}
                placeholder={field.description}
                placeholderTextColor={colors.secondary}
              />
            )}
          />
        </View>
      ))}
      <TouchableOpacity
        style={[styles.btn, { backgroundColor: colors.primary }]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.btnText}>CONFIRM SUBMISSION</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  fieldWrapper: { marginBottom: 20 },
  label: {
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  input: {
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontWeight: "700",
  },
  btn: {
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  btnText: { color: "#fff", fontWeight: "900", letterSpacing: 1 },
});
