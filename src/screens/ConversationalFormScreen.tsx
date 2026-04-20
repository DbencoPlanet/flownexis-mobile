import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import {
  Bot,
  Send,
  User,
  ChevronLeft,
  Sparkles,
  CheckCircle,
} from "lucide-react-native";
import * as Animatable from "react-native-animatable";

export default function MobileConversationalForm({ form, onComplete }: any) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [isAiTyping, setIsAiTyping] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const blocks =
    form.uiSchema?.blocks?.filter((b: any) => b.type !== "section") || [];

  // Initial AI Greeting
  useEffect(() => {
    sendAiMessage(
      `Initializing ${form.name} Protocol. To begin, please provide the ${blocks[0].label}.`,
    );
  }, []);

  const sendAiMessage = (text: string) => {
    setIsAiTyping(true);
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: Date.now(), role: "ai", text }]);
      setIsAiTyping(false);
    }, 1200);
  };

  const handleUserSubmit = () => {
    if (!input.trim() || isAiTyping) return;

    const currentBlock = blocks[step];
    const userValue = input.trim();

    // 1. Log User Message
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text: userValue },
    ]);

    // 2. Update Data State
    const fieldKey = currentBlock.label.toLowerCase().replace(/\s+/g, "_");
    setFormData({ ...formData, [fieldKey]: userValue });
    setInput("");

    // 3. Trigger Next Step or Finish
    if (step < blocks.length - 1) {
      setStep(step + 1);
      sendAiMessage(
        `Acknowledged. Next, what is the ${blocks[step + 1].label}?`,
      );
    } else {
      sendAiMessage(
        "All protocol data has been captured. Ready for submission.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white dark:bg-[#0f172a]"
    >
      {/* HEADER */}
      <View className="px-6 pt-12 pb-4 border-b border-gray-100 dark:border-gray-800 flex-row items-center justify-between">
        <TouchableOpacity className="p-2">
          <ChevronLeft size={24} color="#3b82f6" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-[10px] font-black uppercase tracking-widest text-blue-500">
            Field Agent v12
          </Text>
          <Text className="text-sm font-black dark:text-white">
            {form.name}
          </Text>
        </View>
        <View className="w-10 h-10 rounded-full bg-blue-50 items-center justify-center">
          <Sparkles size={18} color="#3b82f6" />
        </View>
      </View>

      {/* CHAT FEED */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
        className="flex-1 p-6"
        showsVerticalScrollIndicator={false}
      >
        {messages.map((m, idx) => (
          <Animatable.View
            key={m.id}
            animation={m.role === "ai" ? "fadeInLeft" : "fadeInRight"}
            duration={400}
            className={`mb-6 flex-row ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" && (
              <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-3 mt-1 shadow-lg shadow-blue-500/30">
                <Bot size={16} color="white" strokeWidth={3} />
              </View>
            )}
            <View
              className={`max-w-[75%] p-4 rounded-3xl ${
                m.role === "ai"
                  ? "bg-gray-100 dark:bg-gray-800 rounded-tl-none"
                  : "bg-blue-600 rounded-tr-none"
              }`}
            >
              <Text
                className={`text-sm font-bold leading-5 ${m.role === "user" ? "text-white" : "dark:text-gray-200"}`}
              >
                {m.text}
              </Text>
            </View>
          </Animatable.View>
        ))}

        {isAiTyping && (
          <View className="flex-row items-center ml-11 mb-6">
            <ActivityIndicator size="small" color="#3b82f6" />
            <Text className="ml-2 text-[10px] font-black uppercase text-gray-400">
              Agent Inquiring...
            </Text>
          </View>
        )}
      </ScrollView>

      {/* INPUT AREA */}
      <View className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        {step === blocks.length - 1 &&
        messages[messages.length - 1]?.role === "ai" &&
        !isAiTyping ? (
          <TouchableOpacity
            onPress={() => onComplete(formData)}
            className="w-full bg-emerald-500 py-5 rounded-3xl flex-row items-center justify-center shadow-xl shadow-emerald-500/20"
          >
            <CheckCircle size={20} color="white" className="mr-2" />
            <Text className="text-white font-black uppercase tracking-widest text-xs">
              Commit Protocol
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-[2rem] px-5 py-2 border border-gray-200 dark:border-gray-700">
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Respond to Agent..."
              placeholderTextColor="#94a3b8"
              className="flex-1 py-3 font-bold text-sm dark:text-white"
            />
            <TouchableOpacity
              onPress={handleUserSubmit}
              disabled={!input.trim() || isAiTyping}
              className={`w-10 h-10 rounded-full items-center justify-center ${input.trim() ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"}`}
            >
              <Send size={18} color="white" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
