import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import {
  useGetTaskByIdQuery,
  useHandleTaskActionMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
} from "../store/api/baseApi";
import { useTheme } from "../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Check,
  X,
  CornerUpLeft,
  UploadCloud,
  Send,
  MessageSquare,
  Database,
} from "lucide-react-native";
import * as DocumentPicker from "expo-document-picker";

export default function TaskDetailsScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { taskId } = route.params;
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const { data: response, isLoading } = useGetTaskByIdQuery(taskId);
  const task = response?.data;

  const [handleAction, { isLoading: isActing }] = useHandleTaskActionMutation();

  // Comments
  const { data: commentsRes } = useGetCommentsQuery(task?.executionId, {
    skip: !task?.executionId,
  });
  const [addComment, { isLoading: isCommenting }] = useAddCommentMutation();
  const [commentText, setCommentText] = useState("");

  // Sub-form State
  const [showDataModal, setShowDataModal] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [managerNotes, setManagerNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const processAction = async (action: string, formData: any = {}) => {
    try {
      await handleAction({ taskId, action, formData }).unwrap();
      Alert.alert("Success", `Task ${action.toLowerCase()}ed successfully.`);
      navigation.goBack();
    } catch (error: any) {
      Alert.alert("Error", error?.data?.message || `Failed to process action.`);
    }
  };

  const handleActionWithData = (action: string) => {
    setPendingAction(action);
    setShowDataModal(true);
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) {
      setSelectedFile(result.assets[0]);
    }
  };

  const submitActionWithData = () => {
    // In Slice 8/13 we will upload this file to S3. For now, we pass the file name to the engine.
    const formData = {
      notes: managerNotes,
      uploadedFile: selectedFile ? selectedFile.name : null,
    };
    processAction(pendingAction, formData);
    setShowDataModal(false);
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment({
        executionId: task.executionId,
        content: commentText,
        taskId,
      }).unwrap();
      setCommentText("");
    } catch (error) {
      Alert.alert("Error", "Failed to post comment.");
    }
  };

  if (isLoading || !task) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // --- SUB-FORM MODAL RENDER ---
  if (showDataModal) {
    return (
      <View
        className="flex-1 px-6 justify-center"
        style={{ backgroundColor: colors.background }}
      >
        <View
          className="p-6 rounded-3xl border shadow-xl"
          style={{ backgroundColor: colors.card, borderColor: colors.border }}
        >
          <Text
            className="text-lg font-black mb-2"
            style={{ color: colors.foreground }}
          >
            Additional Data Required
          </Text>
          <Text
            className="text-xs font-medium mb-6"
            style={{ color: colors.secondary }}
          >
            Please provide context before proceeding.
          </Text>

          <Text
            className="text-[10px] font-black uppercase tracking-widest mb-2"
            style={{ color: colors.secondary }}
          >
            Manager Notes
          </Text>
          <TextInput
            value={managerNotes}
            onChangeText={setManagerNotes}
            placeholder="Enter required details..."
            placeholderTextColor={colors.secondary}
            className="border rounded-xl px-4 py-3 text-sm mb-6 font-medium"
            style={{
              backgroundColor: colors.background,
              borderColor: colors.border,
              color: colors.foreground,
            }}
          />

          <TouchableOpacity
            onPress={pickDocument}
            className="border-2 border-dashed rounded-xl p-6 items-center justify-center mb-8"
            style={{ borderColor: colors.border }}
          >
            <UploadCloud
              size={24}
              color={selectedFile ? colors.primary : colors.secondary}
              className="mb-2"
            />
            <Text
              className="text-xs font-bold text-center"
              style={{
                color: selectedFile ? colors.primary : colors.secondary,
              }}
            >
              {selectedFile ? selectedFile.name : "Tap to Upload Document"}
            </Text>
          </TouchableOpacity>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setShowDataModal(false)}
              className="flex-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: colors.border }}
            >
              <Text
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: colors.foreground }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={submitActionWithData}
              className="flex-1 py-3 rounded-xl items-center"
              style={{ backgroundColor: colors.primary }}
            >
              <Text className="text-xs font-black uppercase tracking-widest text-white">
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header & Main Actions */}
        <View
          className="p-6 border-b"
          style={{ borderColor: colors.border, backgroundColor: colors.card }}
        >
          <Text
            className="text-xs font-black uppercase tracking-widest mb-1"
            style={{ color: colors.primary }}
          >
            {task.execution?.workflow?.name}
          </Text>
          <Text
            className="text-2xl font-black mb-6"
            style={{ color: colors.foreground }}
          >
            {task.label}
          </Text>

          <View className="flex-row flex-wrap gap-3">
            <TouchableOpacity
              onPress={() => handleActionWithData("APPROVE")}
              disabled={isActing}
              className="flex-1 min-w-[140px] flex-row items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500"
            >
              <Check size={16} color="white" />
              <Text className="text-white text-xs font-black uppercase tracking-widest">
                Approve
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => processAction("REJECT")}
              disabled={isActing}
              className="flex-1 min-w-[140px] flex-row items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10"
            >
              <X size={16} color="#ef4444" />
              <Text className="text-red-500 text-xs font-black uppercase tracking-widest">
                Reject
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => processAction("SEND_BACK")}
              disabled={isActing}
              className="w-full flex-row items-center justify-center gap-2 py-3 rounded-xl"
              style={{ backgroundColor: colors.border }}
            >
              <CornerUpLeft size={16} color={colors.foreground} />
              <Text
                className="text-xs font-black uppercase tracking-widest"
                style={{ color: colors.foreground }}
              >
                Send Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Execution Context */}
        <View className="p-6">
          <View className="flex-row items-center gap-2 mb-4">
            <Database size={14} color={colors.secondary} />
            <Text
              className="text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: colors.secondary }}
            >
              Context Data
            </Text>
          </View>
          <View className="rounded-2xl p-4 bg-gray-900">
            <Text className="text-[10px] font-mono text-blue-300">
              {JSON.stringify(task.execution?.state || {}, null, 2)}
            </Text>
          </View>
        </View>

        {/* Comments Section */}
        <View className="p-6 border-t" style={{ borderColor: colors.border }}>
          <View className="flex-row items-center gap-2 mb-4">
            <MessageSquare size={14} color={colors.secondary} />
            <Text
              className="text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: colors.secondary }}
            >
              Collaboration
            </Text>
          </View>

          {commentsRes?.data?.map((comment: any) => (
            <View
              key={comment.id}
              className="p-4 rounded-xl rounded-tl-none mb-3 border max-w-[85%]"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
              }}
            >
              <Text
                className="text-[10px] font-black uppercase mb-1"
                style={{ color: colors.primary }}
              >
                {comment.userId.substring(0, 8)}...
              </Text>
              <Text
                className="text-sm font-medium leading-relaxed"
                style={{ color: colors.foreground }}
              >
                {comment.content}
              </Text>
            </View>
          ))}

          <View className="flex-row gap-3 mt-4">
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              placeholder="Leave a note..."
              placeholderTextColor={colors.secondary}
              className="flex-1 border rounded-xl px-4 py-3 text-sm font-medium"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.foreground,
              }}
            />
            <TouchableOpacity
              onPress={handleSendComment}
              disabled={isCommenting || !commentText}
              className="p-3 rounded-xl items-center justify-center"
              style={{ backgroundColor: colors.primary }}
            >
              {isCommenting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Send size={18} color="white" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
