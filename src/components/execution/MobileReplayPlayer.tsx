"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Play, Pause, RotateCcw, Zap, ShieldCheck } from "lucide-react-native";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";

export default function MobileReplayPlayer({ execution }: { execution: any }) {
  const { pathHistory = [] } = execution;
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // FIX: Using ReturnType to handle the environment-specific timer type
    let interval: ReturnType<typeof setInterval>;

    if (isPlaying && currentIndex < pathHistory.length - 1) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1200);
    } else {
      setIsPlaying(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentIndex, pathHistory.length]);

  return (
    <View style={styles.container}>
      {/* HEADER CONTROLS */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => setIsPlaying(!isPlaying)}
          style={styles.playButton}
        >
          {isPlaying ? (
            <Pause size={24} color="#FFF" />
          ) : (
            <Play size={24} color="#FFF" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setCurrentIndex(-1)}
          style={styles.iconButton}
        >
          <RotateCcw size={20} color="#64748b" />
        </TouchableOpacity>

        <View style={styles.progressLabel}>
          <Text style={styles.progressText}>
            Step {currentIndex + 1} / {pathHistory.length}
          </Text>
        </View>
      </View>

      {/* VISUAL TIMELINE SCRUBBER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.timelineContent}
      >
        {pathHistory.map((step: any, index: number) => (
          <View key={index} style={styles.stepWrapper}>
            <View
              style={[
                styles.nodeCircle,
                index <= currentIndex ? styles.activeNode : styles.inactiveNode,
              ]}
            >
              <Text style={styles.nodeText}>
                {step.nodeId?.substring(0, 2).toUpperCase() || "??"}
              </Text>
            </View>
            {index < pathHistory.length - 1 && (
              <View
                style={[
                  styles.connector,
                  index < currentIndex
                    ? styles.activeConnector
                    : styles.inactiveConnector,
                ]}
              />
            )}
          </View>
        ))}
      </ScrollView>

      {/* INTELLIGENCE OVERLAY */}
      {currentIndex >= 0 && (
        <Animated.View entering={FadeIn.duration(400)} style={styles.intelCard}>
          <div style={{ display: "none" }}>
            {/* Animated.View wrapper for Lucide icons on mobile */}
          </div>
          <View style={styles.intelHeader}>
            <Zap size={14} color="#3b82f6" />
            <Text style={styles.intelTitle}>EXECUTION DNA</Text>
          </View>
          <Text style={styles.intelAction}>
            {pathHistory[currentIndex].action}
          </Text>
          <Text style={styles.intelTime}>
            {new Date(pathHistory[currentIndex].timestamp).toLocaleTimeString()}
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f8fafc",
    borderRadius: 32,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  controls: { flexDirection: "row", alignItems: "center", marginBottom: 25 },
  playButton: {
    backgroundColor: "#3b82f6",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  iconButton: { padding: 10 },
  progressLabel: { flex: 1, alignItems: "flex-end" },
  progressText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94a3b8",
    letterSpacing: 1,
  },
  timelineContent: { paddingVertical: 20, paddingHorizontal: 10 },
  stepWrapper: { flexDirection: "row", alignItems: "center" },
  nodeCircle: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  activeNode: { backgroundColor: "#eff6ff", borderColor: "#3b82f6" },
  inactiveNode: { backgroundColor: "#FFF", borderColor: "#e2e8f0" },
  nodeText: { fontSize: 12, fontWeight: "900", color: "#1e293b" },
  connector: { width: 30, height: 4 },
  activeConnector: { backgroundColor: "#3b82f6" },
  inactiveConnector: { backgroundColor: "#e2e8f0" },
  intelCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  intelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  intelTitle: {
    fontSize: 10,
    fontWeight: "900",
    color: "#3b82f6",
    letterSpacing: 1,
  },
  intelAction: { fontSize: 16, fontWeight: "900", color: "#1e293b" },
  intelTime: {
    fontSize: 10,
    color: "#94a3b8",
    marginTop: 4,
    fontFamily: "monospace",
  },
});
