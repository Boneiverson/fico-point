import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Phone, ChevronLeft } from "lucide-react-native";
import Input from "@/components/Input";
import Button from "@/components/Button";
import colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";

export default function PhoneSignupScreen() {
  const router = useRouter();
  const { setPhoneNumber, verifyOtp, isLoading } = useAuthStore();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone entry, 2: OTP verification
  const [error, setError] = useState("");

  const validatePhone = () => {
    if (!phone) {
      setError("Phone number is required");
      return false;
    } else if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return false;
    }
    setError("");
    return true;
  };

  const validateOtp = () => {
    if (!otp) {
      setError("OTP is required");
      return false;
    } else if (otp.length < 4) {
      setError("Please enter a valid OTP");
      return false;
    }
    setError("");
    return true;
  };

  const handleSendOtp = () => {
    if (validatePhone()) {
      // Store phone number in state
      setPhoneNumber(phone);
      
      // Move to OTP verification step
      setStep(2);
      
      // In a real app, this would trigger an API call to send OTP
      console.log("Sending OTP to", phone);
    }
  };

  const handleVerifyOtp = async () => {
    if (validateOtp()) {
      try {
        const success = await verifyOtp(otp);
        if (success) {
          // Navigate to registration form
          router.push("/login");
        } else {
          setError("Invalid OTP. Please try again.");
        }
      } catch (error: any) {
        setError(error.message || "Verification failed");
      }
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>
              {step === 1 ? "Enter Your Phone Number" : "Verify Your Phone"}
            </Text>
            <Text style={styles.subtitle}>
              {step === 1
                ? "We'll send you a verification code"
                : "Enter the code we sent to " + phone}
            </Text>

            {error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.form}>
              {step === 1 ? (
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  leftIcon={<Phone size={20} color={colors.textSecondary} />}
                />
              ) : (
                <Input
                  label="Verification Code"
                  placeholder="Enter the 4-digit code"
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  maxLength={4}
                />
              )}

              <Button
                title={step === 1 ? "Send Code" : "Verify"}
                onPress={step === 1 ? handleSendOtp : handleVerifyOtp}
                variant="primary"
                fullWidth
                loading={isLoading}
                style={styles.button}
              />

              {step === 2 && (
                <TouchableOpacity style={styles.resendCode}>
                  <Text style={styles.resendCodeText}>Resend Code</Text>
                </TouchableOpacity>
              )}
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  backButton: {
    marginTop: 16,
    marginBottom: 24,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: colors.error + "20",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
  },
  form: {
    width: "100%",
  },
  button: {
    marginTop: 16,
  },
  resendCode: {
    alignSelf: "center",
    marginTop: 24,
  },
  resendCodeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
});