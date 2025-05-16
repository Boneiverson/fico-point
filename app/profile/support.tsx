import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { MessageSquare, Phone, Mail, Send } from "lucide-react-native";
import Header from "@/components/Header";
import Button from "@/components/Button";
import colors from "@/constants/Colors";

export default function SupportScreen() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!subject.trim()) {
      Alert.alert("Error", "Please enter a subject for your message");
      return;
    }

    if (!message.trim()) {
      Alert.alert("Error", "Please enter your message");
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        "Message Sent",
        "Thank you for contacting us. We'll get back to you as soon as possible.",
        [
          {
            text: "OK",
            onPress: () => {
              setSubject("");
              setMessage("");
              router.back();
            },
          },
        ]
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Contact Support" />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              Need help? Contact our support team and we'll get back to you as soon as possible.
            </Text>
            
            <View style={styles.contactMethods}>
              <View style={styles.contactMethod}>
                <View style={styles.contactIcon}>
                  <Phone size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.contactMethodTitle}>Call Us</Text>
                  <Text style={styles.contactMethodValue}>+233 30 123 4567</Text>
                  <Text style={styles.contactMethodHours}>Mon-Fri, 8am-6pm</Text>
                </View>
              </View>
              
              <View style={styles.contactMethod}>
                <View style={styles.contactIcon}>
                  <Mail size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.contactMethodTitle}>Email Us</Text>
                  <Text style={styles.contactMethodValue}>support@fastloan.com</Text>
                  <Text style={styles.contactMethodHours}>We respond within 24 hours</Text>
                </View>
              </View>
              
              <View style={styles.contactMethod}>
                <View style={styles.contactIcon}>
                  <MessageSquare size={24} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.contactMethodTitle}>Live Chat</Text>
                  <Text style={styles.contactMethodValue}>Available in the app</Text>
                  <Text style={styles.contactMethodHours}>Mon-Fri, 9am-5pm</Text>
                </View>
              </View>
            </View>
            
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>Send us a message</Text>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Subject</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What is your message about?"
                  value={subject}
                  onChangeText={setSubject}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Message</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Please describe your issue or question in detail"
                  value={message}
                  onChangeText={setMessage}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
              
              <Button
                title="Send Message"
                onPress={handleSubmit}
                variant="primary"
                fullWidth
                loading={isLoading}
                icon={<Send size={16} color={colors.white} />}
                iconPosition="right"
                style={styles.submitButton}
              />
            </View>
            
            <View style={styles.faqLink}>
              <Text style={styles.faqText}>
                Have a common question? Check our
              </Text>
              <TouchableOpacity onPress={() => router.push("/profile/faq")}>
                <Text style={styles.faqLinkText}>Frequently Asked Questions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  contactMethods: {
    marginBottom: 24,
  },
  contactMethod: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
  },
  contactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  contactMethodValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginBottom: 2,
  },
  contactMethodHours: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  formContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 120,
  },
  submitButton: {
    marginTop: 8,
  },
  faqLink: {
    alignItems: "center",
    marginBottom: 24,
  },
  faqText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  faqLinkText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
});