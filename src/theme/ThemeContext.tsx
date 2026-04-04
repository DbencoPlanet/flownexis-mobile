import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { useGetBrandingQuery } from "../store/api/baseApi";

type ThemeColors = {
  background: string;
  foreground: string;
  primary: string;
  secondary: string;
  card: string;
  border: string;
  inputBg: string;
};

const ThemeContext = createContext<any>(null);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemScheme = useColorScheme();
  const { data: branding } = useGetBrandingQuery();

  const [manualDark, setManualDark] = useState<boolean | null>(null);
  const isDark = manualDark ?? systemScheme === "dark";

  // State-driven colors that react to isDark
  const [colors, setColors] = useState<ThemeColors>({
    background: "#ffffff",
    foreground: "#0f172a",
    primary: "#2563eb",
    secondary: "#64748b",
    card: "#ffffff",
    border: "#e2e8f0",
    inputBg: "#f8fafc",
  });

  const toggleTheme = () => setManualDark(!isDark);

  useEffect(() => {
    // 1. Set base colors for the current theme mode
    const baseColors = {
      background: isDark ? "#0f172a" : "#ffffff",
      foreground: isDark ? "#f8fafc" : "#0f172a",
      secondary: isDark ? "#94a3b8" : "#64748b",
      card: isDark ? "#1e293b" : "#ffffff",
      border: isDark ? "#334155" : "#e2e8f0",
      inputBg: isDark ? "#0f172a" : "#f8fafc",
      primary: colors.primary, // Keep existing primary until branding overrides it
    };

    // 2. Overlay Tenant Branding from Slice 4 API
    if (branding?.data) {
      baseColors.primary = branding.data.primaryColor || "#2563eb";
    }

    setColors(baseColors);
  }, [isDark, branding]); // Re-run whenever theme or branding changes

  return (
    <ThemeContext.Provider value={{ colors, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
