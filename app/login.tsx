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
import { Phone, Lock, Mail } from "lucide-react-native";
import Input from "@/components/Input";
import Button from "@/components/Button";
import colors from "@/constants/Colors";
import { useAuthStore } from "@/store/auth-store";

export default function LoginScreen() {
  const router = useRouter();
  const { login, register, isLoading, error: authError } = useAuthStore();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    confirmPassword?: string;
  }>({});

  const validateLoginForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegisterForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      confirmPassword?: string;
    } = {};
    
    if (!firstName) {
      newErrors.firstName = "First name is required";
    }
    
    if (!lastName) {
      newErrors.lastName = "Last name is required";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (phoneNumber.length < 10) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (validateLoginForm()) {
      try {
        await login(email, password);
        router.replace("/(tabs)");
      } catch (error: any) {
        console.error("Login error:", error);
      }
    }
  };

  const handleRegister = async () => {
    if (validateRegisterForm()) {
      try {
        await register({
          firstName,
          lastName,
          email,
          phoneNumber,
        }, password);
        router.replace("/(tabs)");
      } catch (error: any) {
        console.error("Registration error:", error);
      }
    }
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoText}>F</Text>
              </View>
            </View>
            
            <Text style={styles.title}>
              {isLogin ? "Welcome Back" : "Create Account"}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin
                ? "Sign in to your account to continue"
                : "Fill in your details to get started"}
            </Text>

            {authError && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{authError}</Text>
              </View>
            )}

            <View style={styles.form}>
              {!isLogin && (
                <>
                  <View style={styles.nameRow}>
                    <Input
                      label="First Name"
                      placeholder="Enter first name"
                      value={firstName}
                      onChangeText={setFirstName}
                      error={errors.firstName}
                      containerStyle={styles.nameInput}
                    />
                    <Input
                      label="Last Name"
                      placeholder="Enter last name"
                      value={lastName}
                      onChangeText={setLastName}
                      error={errors.lastName}
                      containerStyle={styles.nameInput}
                    />
                  </View>
                </>
              )}

              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                leftIcon={<Mail size={20} color={colors.textSecondary} />}
                error={errors.email}
              />

              {!isLogin && (
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  leftIcon={<Phone size={20} color={colors.textSecondary} />}
                  error={errors.phoneNumber}
                />
              )}

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                isPassword
                leftIcon={<Lock size={20} color={colors.textSecondary} />}
                error={errors.password}
              />

              {!isLogin && (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  isPassword
                  leftIcon={<Lock size={20} color={colors.textSecondary} />}
                  error={errors.confirmPassword}
                />
              )}

              {isLogin && (
                <TouchableOpacity style={styles.forgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>
              )}

              <Button
                title={isLogin ? "Sign In" : "Create Account"}
                onPress={isLogin ? handleLogin : handleRegister}
                variant="primary"
                fullWidth
                loading={isLoading}
                style={styles.button}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
              </Text>
              <TouchableOpacity onPress={toggleAuthMode}>
                <Text style={styles.footerLink}>
                  {isLogin ? "Create Account" : "Sign In"}
                </Text>
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
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 40,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.white,
  },
  title: {
    fontSize: 28,
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
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInput: {
    flex: 1,
    marginRight: 8,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: colors.primary,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
});